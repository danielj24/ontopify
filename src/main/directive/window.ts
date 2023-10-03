import AuthWindow from "@/main/window/auth";
import AppWindow from "@/main/window/app";
import checkAuth from "@/util/checkAuth";

export async function resolveWindow() {
  const authed = await checkAuth();

  console.log("[Resolving window]");

  if (!authed) {
    console.log("[No auth key found or token invalid]");
    AuthWindow();
    return;
  }

  AppWindow();
}
