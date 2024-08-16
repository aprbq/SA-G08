import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/SignIn";
import { IngredientInterface } from "../../interfaces/Ingre";
import { PromotionInterface } from "../../interfaces/Promotion";
import { MenuInterface } from "../../interfaces/Menu";
import { OrderInterface } from "../../interfaces/Order";
import { MemberInterface } from "../../interfaces/Member";

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

async function DeleteIngredientsById(id: string) {
  return await axios
    .delete(`${apiUrl}/ingredient/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateIngredients(data: IngredientInterface) {
  return await axios
    .post(`${apiUrl}/signupingre`, data, requestOptions)
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
    .post(`${apiUrl}/signupingre`, data, requestOptions)
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
    .post(`${apiUrl}/signupingre`, data, requestOptions)
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

async function GetPromotionById(id: string) {
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
    .post(`${apiUrl}/signuppromotion`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
//Member

async function GetMember() {
  return await axios
    .get(`${apiUrl}/Member`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMemberById(id: string) {
  return await axios
    .get(`${apiUrl}/Member/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateMemberById(id: string, data: MemberInterface) {
  return await axios
    .put(`${apiUrl}/Member/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteMemberById(id: string) {
  return await axios
    .delete(`${apiUrl}/Member/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMember(data: MemberInterface) {
  return await axios
    .post(`${apiUrl}/signupMember`, data, requestOptions)
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
  GetIngredients,
  GetIngredientsById,
  UpdateIngredientsById,
  DeleteIngredientsById,
  CreateIngredients,
  GetMenu,
  GetMenuById,
  UpdateMenuById,
  DeleteMenuById,
  CreateMenu,

  GetOrder,
  GetOrderById,
  UpdateOrderById,
  DeleteOrderById,
  CreateOrder,

  GetPromotion,
  GetPromotionById,
  UpdatePromotionById,
  DeletePromotionById,
  CreatePromotion,

  GetMember,
  GetMemberById,
  UpdateMemberById,
  DeleteMemberById,
  CreateMember,
};
