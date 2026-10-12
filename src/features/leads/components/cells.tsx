import { Link } from "react-router";

import { paths } from "@/config/paths";
import { MISSING_CONTACT_LABEL } from "@/features/leads/constants";
import type { Lead } from "@/types/api";
import { formatDateTime } from "@/utils/format";
import { getInitials, getInquiryExcerpt } from "@/utils/lead";

type CustomerCellProps = {
  lead: Lead;
  name: Lead["name"];
};

export const CustomerCell = ({ lead, name }: CustomerCellProps) => (
  <Link to={paths.leadDetails.getHref(lead.id)} className="lead-person">
    <span className="avatar" aria-hidden="true">
      {getInitials(name)}
    </span>
    <span className="lead-copy">
      <span className="lead-name">{name}</span>
    </span>
  </Link>
);

export const ContactCell = ({ lead }: { lead: Lead }) => {
  if (lead.email && lead.phone) {
    return (
      <span className="contact-stack">
        <span>{lead.email}</span>
        <span>{lead.phone}</span>
      </span>
    );
  }

  return lead.email ?? lead.phone ?? MISSING_CONTACT_LABEL;
};

export const InquiryCell = ({ message }: { message: Lead["message"] }) => (
  <span className="inquiry-excerpt">{getInquiryExcerpt(message)}</span>
);

export const ReceivedCell = ({
  createdAt,
}: {
  createdAt: Lead["createdAt"];
}) => <time dateTime={createdAt}>{formatDateTime(createdAt)}</time>;
