import { Router } from "express";
import { requireLogin } from "../../middleware/auth";
import * as controller from "./user.controller";

const router = Router();

router.post("/session", controller.session);
router.post("/profile", controller.getPublicProfile);

router.post("/get", requireLogin, controller.get);
router.post("/update", requireLogin, controller.update);

export default router;