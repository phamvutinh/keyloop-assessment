import { MISSING_CONTACT_LABEL } from "@/features/leads/constants";

type ContactValueProps = {
  value: string | null;
};

export const ContactValue = ({ value }: ContactValueProps) => (
  <>{value ?? MISSING_CONTACT_LABEL}</>
);
