package com.google.sps.data;

import java.util.*;

/** A comment on the forum page. */
public final class Comment {

  private final long id;
  private final String name;
  private final String comment;
  private final String email;
  private final String date;
  private final String location;
  private final long parentId;

  // Date must be in format of E MMMM dd yyyy '@' hh:mm a zzz
  // Location must be a valid geolocation
  public Comment(long id, String name, String comment, String email, String date, String location, long parentId) {
    this.id = id;
    this.name = name;
    this.comment = comment;
    this.email = email;
    this.date = date;
    this.location = location;
    this.parentId = parentId;
  }
}