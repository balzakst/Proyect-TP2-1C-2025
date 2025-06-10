import { findAllUsers } from "../data/userData.js";

export const getUsers = async () => {
    return await findAllUsers();
};
