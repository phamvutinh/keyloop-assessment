export const paths = {
  home: {
    path: "/",
  },
  leads: {
    path: "/leads",
  },
  leadDetails: {
    path: "/leads/:leadId",
    getHref: (leadId: string) => `/leads/${encodeURIComponent(leadId)}`,
  },
} as const;
