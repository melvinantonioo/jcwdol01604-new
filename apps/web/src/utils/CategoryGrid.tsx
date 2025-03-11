"use client"

import { ErrorMessage, useFormikContext } from "formik";
import { categories } from "./DataConstant";
import CategoryInput from "./Inputs/CategoryInput";

export function CategoryGrid() {
    const { values, setFieldValue } = useFormikContext<{
        category: string;
    }>();

    return (
        <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Kategori Properti</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <CategoryInput
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        selected={values.category === item.label}
                        onClick={(cat) => setFieldValue("category", cat)}
                    />
                ))}
            </div>
            <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm"
            />
        </div>
    );
}