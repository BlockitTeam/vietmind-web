import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for selectable, draggable events
import { useGetAppointmentDoctor } from "@/hooks/appointment";

const FullFeaturedCalendar = () => {
  const calendarRef = useRef(null) as any;

  const [events, setEvents] = useState([]);

  const {data: appointmentDoctor, isSuccess} = useGetAppointmentDoctor();

  useEffect(() => {
    if (appointmentDoctor && isSuccess) {
      setEvents(appointmentDoctor.data)
    }
  }, [appointmentDoctor])

  const handleEventClick = (clickInfo: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'?`
      )
    ) {
      clickInfo.event.remove();
    }
  };


  // Function to handle today's date navigation
  const handleTodayClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today(); // Navigate to today's date
  };

  // Function to handle date click
  const handleDateClick = (dateClickInfo: any) => {
    const clickedDate = dateClickInfo.dateStr;
    calendarRef.current.getApi().gotoDate(clickedDate);
  };

  const goToDate = (dateString: string) => {
    const calendarApi = calendarRef.current?.getApi(); // Ensure calendarApi exists
    if (calendarApi) {
      calendarApi.changeView('timeGridDay',dateString); // Navigate to the specific date
    }
  };

  return (
    <div className="w-full h-screen z-0">
      <FullCalendar
        height={'100%'}
        ref={calendarRef} // Reference to calendar instance
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // Month view
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        customButtons={{
          myCustomToday: {
            text: "Today",
            click: handleTodayClick, // Custom today button functionality
          },
        }}
        editable={true} // Enables drag and drop
        selectable={true} // Enables date selection
        navLinks={true} // Enable navigation links
        navLinkDayClick={(date) => {
          goToDate(date.toISOString()); // Navigate to the clicked date
        }}
        selectMirror={true}
        dayMaxEvents={true} // Show 'more' link when too many events
        events={events} // Event data
      />
    </div>
  );
};

export default FullFeaturedCalendar;
