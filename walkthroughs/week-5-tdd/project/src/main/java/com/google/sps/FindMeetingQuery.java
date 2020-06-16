// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.*;
import java.util.Collection;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    
    // Meeting is longer than the whole day, return an empty array.
    if (request.getDuration() >= TimeRange.WHOLE_DAY.duration()) {
      return Arrays.asList();
    }

    // If there are no events, return the whole day as time range.
    if (events.isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    Collection<TimeRange> result;
    Collection<String> requestAttendees = request.getAttendees();
    Collection<String> requestAttendeesOptional = request.getOptionalAttendees();

    // If there are no attendees, return the whole day.
    if (requestAttendees.isEmpty() && requestAttendeesOptional.isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

  }

  /**
   * Get all unavailable times in which meeting request attendees are busy.
   * 
   * @param all events to get unavailabilities from
   * @param request attendees to find overlap for
   * @return a set of time ranges that are already occupied
   */
  public Set<TimeRange> getUnavailableTimes(Collection<Event> events, Collection<String> requestAttendees) {
    Set<TimeRange> output = new HashSet<>();

    for (Event e : events) {
      Set<String> eventAttendees = e.getAttendees();
      
      for (String eventAttendee : eventAttendees) {

        // Checks to see if event has overlap with the attendees of the request
        if (requestAttendees.contains(eventAttendee)) {
          output.add(e.getWhen());
          break; // Only one attendee is required for the event time to be unavailable. 
        }
      }
    }
    
    return output;
  }
}
