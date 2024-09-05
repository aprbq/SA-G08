BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "categories" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"category"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "classes" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"class"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "conditions" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"promotion_id"	integer,
	"menu_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_menus_condition" FOREIGN KEY("menu_id") REFERENCES "menus"("id"),
	CONSTRAINT "fk_promotions_condition" FOREIGN KEY("promotion_id") REFERENCES "promotions"("id")
);
CREATE TABLE IF NOT EXISTS "discount_types" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"discount_type_name"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "genders" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"gender"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "ingredients" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"name"	text,
	"quantity"	real,
	"unit"	text,
	"unit_price"	real,
	"price"	real,
	"supplier"	text,
	"exp_date"	datetime,
	"class_id"	integer,
	"users_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_ingredients_class" FOREIGN KEY("class_id") REFERENCES "classes"("id"),
	CONSTRAINT "fk_ingredients_users" FOREIGN KEY("users_id") REFERENCES "users"("id")
);
CREATE TABLE IF NOT EXISTS "menu_ingredients" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"ingredients_id"	integer,
	"menu_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_menu_ingredients_ingredients" FOREIGN KEY("ingredients_id") REFERENCES "ingredients"("id"),
	CONSTRAINT "fk_ingredients_menu_ingredient" FOREIGN KEY("menu_id") REFERENCES "ingredients"("id"),
	CONSTRAINT "fk_menus_menu_ingredient" FOREIGN KEY("menu_id") REFERENCES "menus"("id")
);
CREATE TABLE IF NOT EXISTS "menus" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"name"	text,
	"description"	text,
	"price"	real,
	"category_id"	integer,
	"stock_id"	integer,
	"users_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_menus_category" FOREIGN KEY("category_id") REFERENCES "categories"("id"),
	CONSTRAINT "fk_menus_stock" FOREIGN KEY("stock_id") REFERENCES "stocks"("id"),
	CONSTRAINT "fk_menus_users" FOREIGN KEY("users_id") REFERENCES "users"("id")
);
CREATE TABLE IF NOT EXISTS "paymentmethods" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"payment_method"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "payments" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"payment_amount"	real,
	"payment_date"	datetime,
	"paymentmethod_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_paymentmethods_payment" FOREIGN KEY("paymentmethod_id") REFERENCES "paymentmethods"("id")
);
CREATE TABLE IF NOT EXISTS "promotion_types" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"promotion_type_name"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "promotions" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"promotion_name"	text,
	"description"	text,
	"start_date"	datetime,
	"end_date"	datetime,
	"points_added"	integer,
	"points_use"	integer,
	"discount_value"	real,
	"discount_type_id"	integer,
	"promotion_type_id"	integer,
	"status_id"	integer,
	"users_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_discount_types_promotion" FOREIGN KEY("discount_type_id") REFERENCES "discount_types"("id"),
	CONSTRAINT "fk_promotion_types_promotion" FOREIGN KEY("promotion_type_id") REFERENCES "promotion_types"("id"),
	CONSTRAINT "fk_statuses_promotion" FOREIGN KEY("status_id") REFERENCES "statuses"("id"),
	CONSTRAINT "fk_promotions_users" FOREIGN KEY("users_id") REFERENCES "users"("id")
);
CREATE TABLE IF NOT EXISTS "statuses" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"status_name"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "stocks" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"stock_name"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"first_name"	text,
	"last_name"	text,
	"email"	text,
	"age"	integer,
	"password"	text,
	"birth_day"	datetime,
	"gender_id"	integer,
	"address"	text,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_users_gender" FOREIGN KEY("gender_id") REFERENCES "genders"("id")
);
CREATE INDEX IF NOT EXISTS "idx_categories_deleted_at" ON "categories" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_classes_deleted_at" ON "classes" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_conditions_deleted_at" ON "conditions" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_discount_types_deleted_at" ON "discount_types" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_genders_deleted_at" ON "genders" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_ingredients_deleted_at" ON "ingredients" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_menu_ingredients_deleted_at" ON "menu_ingredients" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_menus_deleted_at" ON "menus" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_paymentmethods_deleted_at" ON "paymentmethods" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_payments_deleted_at" ON "payments" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_promotion_types_deleted_at" ON "promotion_types" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_promotions_deleted_at" ON "promotions" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_statuses_deleted_at" ON "statuses" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_stocks_deleted_at" ON "stocks" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_users_deleted_at" ON "users" (
	"deleted_at"
);
COMMIT;
