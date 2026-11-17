import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Heart,
  Menu,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pandora | Nova coleção com finalização em platina" },
      {
        name: "description",
        content:
          "Conheça a nova geração de joias Pandora com acabamento em platina: charms, pulseiras, anéis e colares.",
      },
    ],
  }),
  component: HomePage,
});

type ArtKind =
  | "bracelet"
  | "heart"
  | "blueHeart"
  | "star"
  | "planet"
  | "flower"
  | "ring"
  | "necklace"
  | "snow"
  | "holly"
  | "dog"
  | "candy"
  | "custom"
  | "character";

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  kind: ArtKind;
};

const products: Product[] = [
  {
    id: 1,
    name: "Pulseira de Malha Brilhante",
    description: "Malha delicada com pedras transparentes e fecho de coração.",
    category: "Pulseiras",
    kind: "bracelet",
  },
  {
    id: 2,
    name: "Charm Coração Curvo",
    description: "Um coração de linhas suaves para expressar sentimentos.",
    category: "Charms de coração",
    kind: "heart",
  },
  {
    id: 3,
    name: "Charm Coração Fosco",
    description: "Acabamento acetinado e visual contemporâneo.",
    category: "Charms de coração",
    kind: "heart",
  },
  {
    id: 4,
    name: "Charm Coração Azul",
    description: "Um toque de azul inspirado na delicadeza das pedras.",
    category: "Charms de coração",
    kind: "blueHeart",
  },
  {
    id: 5,
    name: "Charm Coração Personalizável",
    description: "Uma peça especial para carregar sua própria história.",
    category: "Charms de coração",
    kind: "custom",
  },
  {
    id: 6,
    name: "Charm Estrela",
    description: "Um pequeno brilho para acompanhar seus melhores momentos.",
    category: "Charms temáticos",
    kind: "star",
  },
  {
