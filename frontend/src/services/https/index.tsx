import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/SignIn";
import { IngredientInterface } from "../../interfaces/Ingredient";
import { PromotionInterface } from "../../interfaces/Promotion";
import {ConditionInterface } from "../../interfaces/Condition";
import { MenuInterface } from "../../interfaces/Menu";
import { OrderInterface } from "../../interfaces/Order";
import { OrderItemInterface } from "../../interfaces/OrderItem";
import { MemberInterface } from "../../interfaces/Member";
import { MenuIngredientInterface } from "../../interfaces/MenuIngredient";

import axios from "axios";


const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetStatus() {
  return await axios
    .get(`${apiUrl}/status`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetGender() {
  return await axios
    .get(`${apiUrl}/gender`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPromotionType() {
  return await axios
    .get(`${apiUrl}/promotiontype`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetDiscountType() {
  return await axios
    .get(`${apiUrl}/discounttype`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetCategory() {
  return await axios
    .get(`${apiUrl}/category`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetStock() {
  return await axios
    .get(`${apiUrl}/stock`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsers() {
  return await axios
    .get(`${apiUrl}/users`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsersById(id: string) {
  return await axios
    .get(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateUsersById(id: string, data: UsersInterface) {
  return await axios
    .put(`${apiUrl}/user/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteUsersById(id: string) {
  return await axios
    .delete(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateUser(data: UsersInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Ingredients
async function GetIngredients() {
  return await axios
    .get(`${apiUrl}/ingredient`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetIngredientsById(id: string) {
  return await axios
    .get(`${apiUrl}/ingredient/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateIngredientsById(id: string, data: IngredientInterface) {
  return await axios
    .put(`${apiUrl}/ingredient/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteIngredientsById(id: string | undefined) {
  return await axios
    .delete(`${apiUrl}/ingredient/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateIngredients(data: IngredientInterface) {
  return await axios
    .post(`${apiUrl}/ingredient`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateIngredient(data: UsersInterface) {
  return await axios
    .put(`${apiUrl}/ingredient/${data}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetClass() {
  return await axios
    .get(`${apiUrl}/class`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Order
async function GetOrder() {
  return await axios
    .get(`${apiUrl}/order`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrderById(id: string) {
  return await axios
    .get(`${apiUrl}/order/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateOrderById(id: string, data: OrderInterface) {
  return await axios
    .put(`${apiUrl}/order/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteOrderById(id: string) {
  return await axios
    .delete(`${apiUrl}/order/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateOrder(data: OrderInterface) {
  return await axios
    .post(`${apiUrl}/order`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateOrderitem(data: OrderItemInterface) {
  return await axios
    .post(`${apiUrl}/orderitem`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function SaveOrderItems(orderItems: OrderItemInterface[]): Promise<any> {
  return await axios
    .post(`${apiUrl}/orderitems`, { orderItems }, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPaymentMethods() {
  return await axios
    .get(`${apiUrl}/payment`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


// Menu
async function GetMenu() {
  return await axios
    .get(`${apiUrl}/menu`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMenuById(id: string) {
  return await axios
    .get(`${apiUrl}/menu/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateMenuById(id: string, data: MenuInterface) {
  return await axios
    .put(`${apiUrl}/menu/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteMenuById(id: string) {
  return await axios
    .delete(`${apiUrl}/menu/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMenu(data: MenuInterface) {
  return await axios
    .post(`${apiUrl}/menu`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMenuIngredient(data: MenuIngredientInterface) {
  return await axios
    .post(`${apiUrl}/menuingredient`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMenuIngredient() {
  return await axios
    .get(`${apiUrl}/menuingredient`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMenuIngredientById(id: string) {
  return await axios
    .get(`${apiUrl}/menuingredient/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Promotion
async function GetPromotion() {
  return await axios
    .get(`${apiUrl}/promotion`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPromotionById(id: string ) {
  return await axios
    .get(`${apiUrl}/promotion/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdatePromotionById(id: string, data: PromotionInterface) {
  return await axios
    .put(`${apiUrl}/promotion/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeletePromotionById(id: string) {
  return await axios
    .delete(`${apiUrl}/promotion/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreatePromotion(data: PromotionInterface) {
  return await axios
    .post(`${apiUrl}/promotion`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateCondition(data: ConditionInterface) {
  return await axios
    .post(`${apiUrl}/condition`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetCondition() {
  return await axios
    .get(`${apiUrl}/condition`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
//Member

async function GetMember() {
  return await axios
    .get(`${apiUrl}/member`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMemberById(id: string) {
  return await axios
    .get(`${apiUrl}/member/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateMemberById(id: string, data: MemberInterface) {
  return await axios
    .put(`${apiUrl}/member/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteMemberById(id: string) {
  return await axios
    .delete(`${apiUrl}/member/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMember(data: MemberInterface) {
  return await axios
    .post(`${apiUrl}/member`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrdersweet() {
  return await axios
    .get(`${apiUrl}/ordersweet`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}



export {
  SignIn,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
  GetStatus,
  GetGender,
  GetIngredients,
  GetIngredientsById,
  UpdateIngredientsById,
  DeleteIngredientsById,
  CreateIngredients,
  UpdateIngredient,
  GetClass,

  GetCategory,
  GetStock,
  GetMenu,
  GetMenuById,
  UpdateMenuById,
  DeleteMenuById,
  CreateMenu,
  CreateMenuIngredient,
  GetMenuIngredient,
  GetMenuIngredientById,

  GetOrder,
  GetOrderById,
  GetPaymentMethods,
  UpdateOrderById,
  DeleteOrderById,
  CreateOrder,
  GetOrdersweet,
  CreateOrderitem,
  SaveOrderItems,

  GetPromotion,
  GetCondition,
  GetPromotionType,
  GetDiscountType,
  GetPromotionById,
  UpdatePromotionById,
  DeletePromotionById,
  CreatePromotion,
  CreateCondition,

  GetMember,
  GetMemberById,
  UpdateMemberById,
  DeleteMemberById,
  CreateMember,
};
