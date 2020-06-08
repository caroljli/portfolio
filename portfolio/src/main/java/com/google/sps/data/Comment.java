package com.google.sps.data;

import java.util.*;
import com.google.sps.data.Reply;

/** A comment on the forum page. */
public final class Comment {

  private final long id;
  private final String name;
  private final String comment;
  private final String email;
  private final String date;
  private final long parentId;

  // Date must be in format of E MMMM dd yyyy '@' hh:mm a zzz
  public Comment(long id, String name, String comment, String email, String date, long parentId) {
    this.id = id;
    this.name = name;
    this.comment = comment;
    this.email = email;
    this.date = date;
    this.parentId = parentId;
  }
}