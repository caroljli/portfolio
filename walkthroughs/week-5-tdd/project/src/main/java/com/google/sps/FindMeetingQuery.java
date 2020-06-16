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

    // Get unavailable times for mandatory attendees.
    List<TimeRange> unavailableTimes = getUnavailableTimes(events, requestAttendees);
    Collections.sort(unavailableTimes, TimeRange.ORDER_BY_START);

    // Get unavailable times for optional attendees.
    List<TimeRange> unavailableTimesOptional = getUnavailableTimes(events, requestAttendeesOptional);
    Collections.sort(unavailableTimesOptional, TimeRange.ORDER_BY_START);

    return getAvailableTimes(request.getDuration(), unavailableTimes, unavailableTimesOptional);

  }

  /**
   * Get all unavailable times in which meeting request attendees are busy.
   * 
   * @param events to get unavailabilities from
   * @param requestAttendees to find overlap for
   * @return list of time ranges that are already occupied
   */
  public List<TimeRange> getUnavailableTimes(Collection<Event> events, Collection<String> requestAttendees) {
    List<TimeRange> output = new HashSet<>();

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

  /**
   * Gets all available times for the meeting request attendees that contain the most available attendees.
   *
   * @param duration of meeting request
   * @param unavailableTimes of mandatory attendees
   * @param unavailableTimesOptional of optional attendees
   */
  public List<TimeRange> getAvailableTimes(long duration, List<TimeRange> unavailableTimes, List<TimeRange> unavailableTimesOptional) {
    // Finds all timeslots in which mandatory attendees can attend
    List<TimeRange> attendeeTimes = getNonOverlappingTimes(duration, unavailableTimes);

    // Find all timeslots within those timeslots that optional attendees can attend
    // TODO: this returns all avail times
    List<TimeRange> attendeeTimesOptional = getNonOverlappingTimes(duration, unavailableTimesOptional);
    
    // If none exist, return original timeslots
    // Sort by start time

    // TODO: implement :")
  }

  /**
   * Finds all non-overlapping times in a day given overlapping time ranges.
   *
   * @param duration of meeting request
   * @param unavailableTimes listed in ascending order by start time
   * @return all available time frames from start to end of day that fit with duration
   */
  public List<TimeRange> getNonOverlappingTimes(long duration, List<TimeRange> unavailableTimes) {
    List<TimeRange> availableTimes = new ArrayList<>();
    int start = TimeRange.START_OF_DAY;

    for (TimeRange t : unavailableTimes) {
      TimeRange temp = TimeRange.fromStartDuration(start, t.start(), false);
      start = t.end();
      if (temp.duration() >= duration) {
        availableTimes.add(temp);
      }
    }

    TimeRange endOfDayTemp = TimeRange.fromStartDuration(start, TimeRange.END_OF_DAY, true);
    if (endOfDayTemp.duration() >= duration) {
      availableTimes.add(endOfDayTemp);
    }

    return availableTimes;
  }
}
