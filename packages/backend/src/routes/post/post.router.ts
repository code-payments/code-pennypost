import { Router } from "express";
import { requireLogin } from "../../middleware/auth";
import * as controller from "./post.controller";

const router = Router();

router.post("/create", requireLogin, controller.create);
router.post("/get", controller.get);
router.post("/get-paginated", controller.getPaginated);

export default router;