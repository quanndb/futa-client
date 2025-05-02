"use client";
import { useSearchParams } from "next/navigation";

export default function TicketBooking() {
  const searchParams = useSearchParams();
  const departureDate = searchParams.get("departureDate") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const departureTripId = searchParams.get("departureTripId") || "";
  const returnTripId = searchParams.get("returnTripId") || "";
  console.log(departureDate, returnDate, departureTripId, returnTripId);
  return (
    <div>
      TicketBooking:
      <p> Departue date: {departureDate}</p>
      <p> Departure trip id: {departureTripId}</p>
      <p> Return date: {returnDate}</p>
      <p> Return trip id: {returnTripId}</p>
    </div>
  );
}
