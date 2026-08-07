import type { Router } from "express";

/** Contract that every router must implement */
export interface IRouter {
  /** Express Router instance with registered handlers */
  router: Router;
  /** Registers route handlers on this.router */
  routes(): void;
}
