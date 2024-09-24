import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
const Employee = Loadable(lazy(() => import("../pages/employee")));
const CreateEmployee = Loadable(lazy(() => import("../pages/employee/create")));
const EditEmployee = Loadable(lazy(() => import("../pages/employee/edit")));
const Menus = Loadable(lazy(() => import("../pages/menu")));
const CreateMenu = Loadable(lazy(() => import("../pages/menu/create")));
const EditMenu = Loadable(lazy(() => import("../pages/menu/edit")));
const Ingredient = Loadable(lazy(() => import("../pages/ingredient")));
const CreateIngredient = Loadable(lazy(() => import("../pages/ingredient/create")));
const EditIngredient = Loadable(lazy(() => import("../pages/ingredient/edit")));
const Promotion = Loadable(lazy(() => import("../pages/promotion")));
const CreatePromotion = Loadable(lazy(() => import("../pages/promotion/create")));
const EditPromotion = Loadable(lazy(() => import("../pages/promotion/edit")));
const HistoryPromotion = Loadable(lazy(() => import("../pages/promotion/history")));

const Order = Loadable(lazy(() => import("../pages/order")));
const CreateOrder = Loadable(lazy(() => import("../pages/order/create")));
const EditOrder = Loadable(lazy(() => import("../pages/order/edit")));
const ConfirmOrder = Loadable(lazy(() => import("../pages/order/create/createorder")));
const QrPage = Loadable(lazy(() => import("../pages/order/qrpage")));


const Member = Loadable(lazy(() => import("../pages/member")));
const CreateMember = Loadable(lazy(() => import("../pages/member/create")));
const EditMember = Loadable(lazy(() => import("../pages/member/edit")));

const Supplier = Loadable(lazy(() => import("../pages/supplier")));
const CreateSupplier = Loadable(lazy(() => import("../pages/supplier/create")));
const EditSupplier = Loadable(lazy(() => import("../pages/supplier/edit")));

const AdminRoutes = (isLoggedIn: boolean): RouteObject => {
  return {
    path: "/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/employee",
        children: [
          {
            path: "/employee",
            element: <Employee />,
          },
          {
            path: "/employee/create",
            element: <CreateEmployee />,
          },
          {
            path: "/employee/edit/:id",
            element: <EditEmployee />,
          },
        ],
      },
      {
        path: "menus",
        children: [
          {
            path: "",
            element: <Menus />,
          },
          {
            path: "create",
            element: <CreateMenu />,
          },
          {
            path: "edit/:id",
            element: <EditMenu />,
          },
        ],
      },

      {
        path: "order",
        children: [
          {
            path: "",
            element: <Order />,
          },
          {
            path: "create",
            element: <CreateOrder />,
            children: [
              {
                path: "createorder",
                element: <ConfirmOrder />,
              },
            ],
          },
          {
            path: "edit/:id",
            element: <EditOrder />,
          },
          {
            path: "qrpage",
            element: <QrPage />,
          },
        ],
      }
      ,

      {
        path: "ingredient",
        children: [
          {
            path: "",
            element: <Ingredient />,
          },
          {
            path: "create",
            element: <CreateIngredient />,
          },
          {
            path: "edit/:id",
            element: <EditIngredient />,
          },
        ],
      },
      {
        path: "supplier",
        children: [
          {
            path: "",
            element: <Supplier />,
          },
          {
            path: "create",
            element: <CreateSupplier />,
          },
          {
            path: "edit/:id",
            element: <EditSupplier />,
          },
        ],
      },
      {
        path: "promotion",
        children: [
          {
            path: "",
            element: <Promotion />,
          },
          {
            path: "create",
            element: <CreatePromotion />,
          },
          {
            path: "edit/:id",
            element: <EditPromotion />,
          },
          {
            path: "history",
            element: <HistoryPromotion />,
          },
        ],
      },
      {
        path: "member",
        children: [
          {
            path: "",
            element: <Member />,
          },
          {
            path: "create",
            element: <CreateMember />,
          },
          {
            path: "edit/:id",
            element: <EditMember />,
          },
        ],
      },
    ],
  };
};

export default AdminRoutes;
