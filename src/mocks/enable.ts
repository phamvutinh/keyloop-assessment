export const enableMocking = async () => {
  if (import.meta.env.VITE_ENABLE_MOCKING === "false") {
    return;
  }

  const { worker } = await import("@/mocks/browser");

  await worker.start({
    onUnhandledRequest: "bypass",
  });
};
