# Setup

## requirements
- node version: v22.14.0, npm version:10.9.2
- postgres

## env setup
- copy .env.example as .env
- update the values in .env filel

## run the project
```bash
npm run setup
```
run this command to setup the migration

```bash
npm run dev
```
to run the project

postman collection is added to root of the project


# About Project
## DB Schema Design
Link to [Database Design](https://dbdiagram.io/d/Product-Dashboard-6805e9e51ca52373f5b386fe)

![DB Design Image](./public/ProductDashboardSchema.png)


## Code Structure
```
src/
    config/ -- setting for the application like database
    controller/
    middlware/
    models/
    repositories/
    routes/ -- has routes defined for the analytics endpoints
    services/
    workers/
    
```