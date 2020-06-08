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

package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.sps.data.Comment;
import java.util.*;
import java.text.*;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comment").addSort("name", SortDirection.ASCENDING);

    PreparedQuery results = datastore.prepare(query);

    List<Comment> comments = new ArrayList<>();

    for (Entity entity : results.asIterable()) {
      long id = entity.getKey().getId();
      String name = entity.getProperty("name").toString();
      String comment = entity.getProperty("comment").toString();
      String email = entity.getProperty("email").toString();
      String date = entity.getProperty("date").toString();

      Comment fullComment = new Comment(id, name, comment, email, date, -1);
      comments.add(fullComment);
    }
    
    Gson gson = new Gson();
    String commentsJson = gson.toJson(comments);
    
    response.setContentType("application/json;");
    response.getWriter().println(commentsJson);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    SimpleDateFormat ft = new SimpleDateFormat("E MMMM dd yyyy '@' hh:mm a zzz");
    
    String name = request.getParameter("name");
    String comment = request.getParameter("comment");
    String email = request.getParameter("email");
    Date dateRaw = new Date();
    String date = ft.format(dateRaw).toString();

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("name", name);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("email", email);
    commentEntity.setProperty("date", date);

    datastore.put(commentEntity);

    response.sendRedirect("/forum.html");
  }
}
