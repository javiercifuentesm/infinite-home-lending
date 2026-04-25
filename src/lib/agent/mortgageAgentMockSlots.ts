/** Mock scheduling slots — replace with calendar API later */

export interface MockSlot {
  id: string;
  label: string;
}

export function getMockAppointmentSlots(): MockSlot[] {
  return [
    { id: "t1", label: "Today, 3:00 PM" },
    { id: "t2", label: "Today, 5:30 PM" },
    { id: "t3", label: "Tomorrow, 10:00 AM" },
    { id: "t4", label: "Tomorrow, 1:30 PM" },
    { id: "t5", label: "Thursday, 11:00 AM" },
    { id: "t6", label: "Thursday, 4:00 PM" },
  ];
}
