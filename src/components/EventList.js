import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

class EventList extends React.Component {
   constructor() {
      super()
      this.state = {
         events: null,
         conferences: null,
         attendees: null,
         speakers: null,
         eventIsExpanded: false,
         conferenceIsExpanded: false,
      }
   }

   componentDidMount() {
      axios.get('https://bluesky-fe-challenge.herokuapp.com/events')
      .then((response) => {
         this.setState({ events: response.data.data.events });
      })
      .catch((error) => {
         console.log(error);
      })
   }

   getConferences(event, id) {
      axios.get(`https://bluesky-fe-challenge.herokuapp.com/events/${id}/conferences`)
      .then((response) => {
         this.setState({ conferences: response.data });
      })
      .catch((error) => {
         console.log(error);
      })
   }

   getAttendees(event, id) {
      axios.get(`https://bluesky-fe-challenge.herokuapp.com/conferences/${id}/attendees`)
      .then((response) => {
         this.setState({ attendees: response.data });
      })
      .catch((error) => {
         console.log(error);
      })
   }

   getSpeakers(event, id) {
      axios.get(`https://bluesky-fe-challenge.herokuapp.com/conferences/${id}/speakers`)
      .then((response) => {
         this.setState({ speakers: response.data });
      })
      .catch((error) => {
         console.log(error);
      })
   }

   handleEventChange = (panel) => (event, isExpanded) => {
      let value
      if (isExpanded) {
         value = panel
      }
      else value = false
      this.setState({ eventIsExpanded: value });
   };

   handleConferenceChange = (panel) => (event, isExpanded) => {
      let value
      if (isExpanded) {
         value = panel
      }
      else value = false
      this.setState({ conferenceIsExpanded: value });
   };

   

   render() {
      
      return (
         <div>
           {this.state.events && this.state.events.map((event, index) => {
              return (
                  <Accordion key={index} expanded={this.state.eventIsExpanded === index} onChange={this.handleEventChange(index)}>
                     <AccordionSummary
                       aria-controls="panel1a-content"
                       id="panel1a-header"
                       name="accordion"
                     >
                     <Typography><h2 className="event-title">{event.title}</h2></Typography>
                     </AccordionSummary>
                     <AccordionDetails>
                        <Typography>
                           <p className="description">{event.description}</p>
                           <p>Starts: {event.starts_at.utc_pretty}</p>
                           <p>Ends: {event.ends_at.utc_pretty}</p>
                           <Accordion key={index}>
                              <AccordionSummary
                                 aria-controls="panel1a-content"
                                 id="panel1a-header"
                                 name="accordion"
                              >
                                 <Typography onClick={e=>this.getConferences(e, event.event_id)}><button type="button"><h3>Show/Hide All Conferences ({event.conferences})</h3></button></Typography>
                              </AccordionSummary>
                              {this.state.conferences && this.state.conferences.response.conferences.map((conference, index) => {
                                 return (
                                    <AccordionDetails>
                                       <Typography>
                                             <Accordion key={index} expanded={this.state.conferenceIsExpanded === index} onChange={this.handleConferenceChange(index)}>
                                                <AccordionSummary
                                                   aria-controls="panel1a-content"
                                                   id="panel1a-header"
                                                   name="accordion"
                                                >
                                                <Typography>                                             
                                                   <h3 className="conference-title">{conference.title}</h3>
                                                </Typography>
                                             </AccordionSummary>
                                             <AccordionDetails style={{ display: 'block' }}>
                                                <p className="description">{conference.description}</p>
                                                <p>Starts: {conference.starts_at.utc_pretty}</p>
                                                <p>Ends: {conference.ends_at.utc_pretty}</p>
                                                <Accordion style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                                                   <AccordionSummary>
                                                      <Typography onClick={e=>this.getAttendees(e, conference.conference_id)}><button type="button"><h3>Show/Hide All Attendees ({conference.attendees})</h3></button></Typography>
                                                   </AccordionSummary>
                                                   {this.state.attendees && this.state.attendees.response.attendees.map((attendee, index) => {
                                                      return (
                                                         <AccordionDetails>
                                                            <Typography>
                                                               <h4>{attendee.first_name} {attendee.last_name}</h4>
                                                               <ul>
                                                                  <li>{attendee.email}</li>
                                                               </ul>
                                                            </Typography>
                                                         </AccordionDetails>
                                                      )
                                                   })}
                                                </Accordion>
                                                <Accordion style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                                                   <AccordionSummary>
                                                      <Typography onClick={e=>this.getSpeakers(e, conference.conference_id)}><button type="button"><h3>Show/Hide All Speakers ({conference.speakers})</h3></button></Typography>
                                                   </AccordionSummary>
                                                   {this.state.speakers && this.state.speakers.response.speakers.map((speaker, index) => {
                                                      return (
                                                         <AccordionDetails>
                                                            <Typography>
                                                               <h4>{speaker.first_name} {speaker.last_name}</h4>
                                                               <ul>
                                                                  <li>{speaker.email}</li>
                                                                  <li>{speaker.company}</li>
                                                                  <li>{speaker.job_title}</li>
                                                               </ul>
                                                            </Typography>
                                                         </AccordionDetails>
                                                      )
                                                   })}
                                             </Accordion>
                                             </AccordionDetails>
                                             </Accordion>
                                       </Typography>
                                    </AccordionDetails>
                                 )
                              })}
                           </Accordion>
                        </Typography>
                     </AccordionDetails>
                  </Accordion>
               )
            })}
         </div>
       );
   }
}

export default EventList;