import { Router } from "express";
import * as controller from "./login.controller";

const router = Router();

router.post("/create", controller.create);

export default router;