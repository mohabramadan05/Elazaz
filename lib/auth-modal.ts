export type AuthModalMode = "login" | "signup";

export type OpenAuthModalDetail = {
  mode?: AuthModalMode;
};

export const AUTH_MODAL_OPEN_EVENT = "auth:open-modal";

export const openAuthModal = (mode: AuthModalMode = "login") => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OpenAuthModalDetail>(AUTH_MODAL_OPEN_EVENT, {
      detail: { mode },
    }),
  );
};
