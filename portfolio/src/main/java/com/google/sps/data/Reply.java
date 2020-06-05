package com.google.sps.data;

import java.util.*;

/** A comment on the forum page. */
public final class Reply {

  private final long id;
  private final String name;
  private final String comment;
  private final String email;
  private final String date;
  private final long parentId;

  public Reply(long id, String name, String comment, String email, String date, long parentId) {
    this.id = id;
    this.name = name;
    this.comment = comment;
    this.email = email;
    this.date = date;
    this.parentId = parentId;
  }
}