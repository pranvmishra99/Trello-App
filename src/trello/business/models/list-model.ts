import { CardType } from "./card-model";

export interface ListType {
  id: string
  title: string
  cards: CardType[]
}