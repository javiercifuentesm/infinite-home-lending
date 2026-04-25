export function AgentConfirmation({
  name,
  appointment,
  contactMethod,
  email,
  phone,
}: {
  name: string;
  appointment: string;
  contactMethod: string;
  email: string;
  phone: string;
}) {
  return (
    <div className="rounded-[4px] border border-slate-200/90 bg-white px-4 py-4">
      <ul className="space-y-3 text-[15px]">
        <li className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <span className="text-slate-500">Name</span>
          <span className="font-medium text-navy">{name}</span>
        </li>
        <li className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <span className="text-slate-500">Appointment</span>
          <span className="font-medium text-navy text-right">{appointment}</span>
        </li>
        <li className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <span className="text-slate-500">Contact</span>
          <span className="font-medium text-navy">{contactMethod}</span>
        </li>
        <li className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <span className="text-slate-500">Email</span>
          <span className="break-all font-medium text-navy sm:text-right">{email}</span>
        </li>
        {phone ? (
          <li className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <span className="text-slate-500">Phone</span>
            <span className="font-medium text-navy">{phone}</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
