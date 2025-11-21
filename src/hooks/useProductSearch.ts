import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export const useProductSearch = (searchQuery: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return { products, isLoading, error };
};
