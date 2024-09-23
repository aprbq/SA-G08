import { EmployeeInterface } from "../../interfaces/Employee";
import { SignInInterface } from "../../interfaces/SignIn";
import { IngredientInterface } from "../../interfaces/Ingredient";
import { PromotionInterface } from "../../interfaces/Promotion";
import { ConditionInterface } from "../../interfaces/Condition";
import { MenuInterface } from "../../interfaces/Menu";
import { OrderInterface } from "../../interfaces/Order";
import { SupplierInterface } from "../../interfaces/Supplier";
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

async function GetEmployee() {
  return await axios
    .get(`${apiUrl}/employee`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetEmployeeById(id: string) {
  return await axios
    .get(`${apiUrl}/employee/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateEmployeeById(id: string, data: EmployeeInterface) {
  return await axios
    .put(`${apiUrl}/employee/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteEmployeeById(id: string) {
  return await axios
    .delete(`${apiUrl}/employee/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateEmployee(data: EmployeeInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetRole() {
  return await axios
    .get(`${apiUrl}/role`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Ingredients
async function GetIngredients() {
  return await axios
    .get(`${apiUrl}/ingredients`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetIngredientsById(id: string) {
  return await axios
    .get(`${apiUrl}/ingredients/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateIngredientsById(id: string, data: IngredientInterface) {
  return await axios
    .put(`${apiUrl}/ingredients/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteIngredientsById(id: string | undefined) {
  return await axios
    .delete(`${apiUrl}/ingredients/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateIngredients(data: IngredientInterface) {
  return await axios
    .post(`${apiUrl}/ingredients`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateIngredient(data: EmployeeInterface) {
  return await axios
    .put(`${apiUrl}/ingredient/${data}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUnits() {
  return await axios
    .get(`${apiUrl}/unit`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Ingredients
async function GetSuppliers() {
  return await axios
    .get(`${apiUrl}/suppliers`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetSupplierById(id: string) {
  return await axios
    .get(`${apiUrl}/supplier/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateSupplierById(id: string, data: SupplierInterface) {
  return await axios
    .put(`${apiUrl}/supplier/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteSupplierById(id: string | undefined) {
  return await axios
    .delete(`${apiUrl}/supplier/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateSupplier(data: SupplierInterface) {
  return await axios
    .post(`${apiUrl}/supplier`, data, requestOptions)
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

async function UpdateMenuIngredientById(id: string, data: MenuIngredientInterface) {
  return await axios
    .put(`${apiUrl}/menuingredient/${id}`, data, requestOptions)
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

async function UpdatePromotionStatusById(id: string, data: PromotionInterface) {
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

async function GetConditionById(id: string) {
  return await axios
    .get(`${apiUrl}/condition/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateConditionById(id: string, data: ConditionInterface) {
  return await axios
    .put(`${apiUrl}/condition/${id}`, data, requestOptions)
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
async function UpdateMemberStatusById(id: string, status_id: number,end_date:Date) {
  return await axios
    .put(
      `${apiUrl}/member/${id}`,
      { status_id,end_date },  // ส่งเฉพาะ status_id และend_dateในรูปแบบ JSON
      requestOptions
    )
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

// async function GetRowsMenu() {
//   return await axios
//     .get(`${apiUrl}/countmenu`, requestOptions)
//     .then((res) => res)
//     .catch((e) => e.response);
// }

// async function GetRowsEm() {
//   return await axios
//     .get(`${apiUrl}/countemployee`, requestOptions)
//     .then((res) => res)
//     .catch((e) => e.response);
// }

// async function GetRowMembers() {
//   return await axios
//     .get(`${apiUrl}/countmember`, requestOptions)
//     .then((res) => res)
//     .catch((e) => e.response);
// }

// async function GetRowIngredients() {
//   return await axios
//     .get(`${apiUrl}/countingredient`, requestOptions)
//     .then((res) => res)
//     .catch((e) => e.response);
// }

// async function GetRowPromotions() {
//   return await axios
//     .get(`${apiUrl}/countpromotion`, requestOptions)
//     .then((res) => res)
//     .catch((e) => e.response);
// }



export {
  SignIn,
  GetEmployee,
  GetEmployeeById,
  UpdateEmployeeById,
  DeleteEmployeeById,
  CreateEmployee,
  GetStatus,
  GetRole,
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
  UpdateMenuIngredientById,

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
  GetConditionById,
  GetPromotionType,
  GetDiscountType,
  GetPromotionById,
  UpdatePromotionById,
  DeletePromotionById,
  CreatePromotion,
  CreateCondition,
  UpdateConditionById,
  UpdatePromotionStatusById,

  GetMember,
  GetMemberById,
  UpdateMemberById,
  DeleteMemberById,
  CreateMember,
  UpdateMemberStatusById,

  GetSuppliers,
  GetSupplierById,
  UpdateSupplierById,
  DeleteSupplierById,
  CreateSupplier,
  GetUnits,

  // GetRowsMenu,
  // GetRowsEm,
  // GetRowMembers,
  // GetRowIngredients,
  // GetRowPromotions,
  

};
