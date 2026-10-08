export const enableMocking = async () => {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("@/mocks/browser");

  await worker.start({
    onUnhandledRequest: "bypass",
  });
};
