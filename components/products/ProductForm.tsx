"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Category, Product, ProductColor } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { extractErrorMessage } from "@/lib/http";
import { Button } from "@/components/ui/Button";
import { Field, inputClass, textareaClass } from "@/components/ui/Field";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  ProductInput,
} from "@/lib/queries/products";

function categoryId(product?: Product) {
  if (!product) return "";
  const category = product.category;
  return typeof category === "string" ? category : category._id;
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [categoryIdValue, setCategoryIdValue] = useState(categoryId(product));
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [oldPrice, setOldPrice] = useState(product?.oldPrice?.toString() ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [details, setDetails] = useState(product?.details?.join("\n") ?? "");
  const [sizes, setSizes] = useState(product?.sizes?.join(", ") ?? "");
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors?.length ? product.colors : [{ name: "", hex: "#000000" }]
  );
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isBestseller, setIsBestseller] = useState(product?.isBestseller ?? false);

  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation(product?._id ?? "");
  const mutation = isEdit ? updateProduct : createProduct;

  const selectedCategory = useMemo(
    () => categories.find((c) => c._id === categoryIdValue),
    [categories, categoryIdValue]
  );

  function updateColor(index: number, field: keyof ProductColor, value: string) {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function addColor() {
    setColors((prev) => [...prev, { name: "", hex: "#000000" }]);
  }

  function removeColor(index: number) {
    setColors((prev) => prev.filter((_, i) => i !== index));
  }

  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (!categoryIdValue) {
      setValidationError("Оберіть категорію");
      return;
    }
    if (!subcategory) {
      setValidationError("Оберіть підкатегорію");
      return;
    }

    const payload: ProductInput = {
      name: name.trim(),
      slug: product?.slug ?? slugify(name).replace(/\s+/g, "-"),
      category: categoryIdValue,
      subcategory,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      description: description.trim(),
      details: details.split("\n").map((d) => d.trim()).filter(Boolean),
      sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: colors.filter((c) => c.name.trim() && c.hex.trim()),
      isNew,
      isBestseller,
    };

    try {
      await mutation.mutateAsync(payload);
      router.push("/products");
    } catch {
      // surfaced below via mutation.error
    }
  }

  const error = validationError || (mutation.isError ? extractErrorMessage(mutation.error) : null);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Field label="Назва товару" htmlFor="name">
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Категорія" htmlFor="category">
          <select
            id="category"
            value={categoryIdValue}
            onChange={(e) => {
              setCategoryIdValue(e.target.value);
              setSubcategory("");
            }}
            required
            className={inputClass}
          >
            <option value="">Оберіть категорію</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Підкатегорія" htmlFor="subcategory">
          <select
            id="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
            disabled={!selectedCategory}
            className={inputClass}
          >
            <option value="">Оберіть підкатегорію</option>
            {selectedCategory?.subcategories.map((sub) => (
              <option key={sub._id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ціна, грн" htmlFor="price">
          <input
            id="price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Стара ціна, грн (необовʼязково)" htmlFor="oldPrice">
          <input
            id="oldPrice"
            type="number"
            min={0}
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Опис" htmlFor="description">
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className={textareaClass}
        />
      </Field>

      <Field label="Склад і догляд (кожен пункт з нового рядка)" htmlFor="details">
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          className={textareaClass}
        />
      </Field>

      <Field label="Розміри (через кому)" htmlFor="sizes">
        <input
          id="sizes"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          placeholder="XS, S, M, L, XL"
          className={inputClass}
        />
      </Field>

      <div>
        <p className="mb-2 block text-sm font-medium text-ink">Кольори</p>
        <div className="space-y-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={color.name}
                onChange={(e) => updateColor(index, "name", e.target.value)}
                placeholder="Назва кольору"
                className={inputClass}
              />
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(index, "hex", e.target.value)}
                className="h-10 w-14 shrink-0 rounded-lg border border-line bg-paper"
              />
              <button
                type="button"
                onClick={() => removeColor(index)}
                aria-label="Видалити колір"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-danger"
              >
                <LuTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addColor}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-accent"
        >
          <LuPlus size={14} /> Додати колір
        </button>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-ink"
          />
          Новинка
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={isBestseller}
            onChange={(e) => setIsBestseller(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-ink"
          />
          Бестселер
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Збереження..." : isEdit ? "Зберегти зміни" : "Створити товар"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/products")}>
          Скасувати
        </Button>
      </div>
    </form>
  );
}
