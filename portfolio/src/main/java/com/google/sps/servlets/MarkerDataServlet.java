package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.*;
import java.util.Map;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.function.Function; 
import java.util.stream.Collectors;
import com.google.sps.data.Marker;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;


@WebServlet("/marker-data")
public class MarkerDataServlet extends HttpServlet {

  private Map<String, Long> countryCount = new HashMap<>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    Collection<Marker> markers = getMarkers();

    Collection<String> countryNames = new ArrayList<>();

    for (Marker marker : markers) {
      countryNames.add(marker.getCountry());
    }

    countryCount = countryNames.stream().collect(
      Collectors.groupingBy(
        Function.identity(), Collectors.counting()
      )
    );

    System.out.println(countryCount + " is the countrycount");

    Gson gson = new Gson();
    String json = gson.toJson(countryCount);
    response.getWriter().println(json);
  }

  // Fetches Marker from Datastore.
  private Collection<Marker> getMarkers() {
    Collection<Marker> markers = new ArrayList<>();

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query = new Query("Marker");
    PreparedQuery results = datastore.prepare(query);

    for (Entity entity : results.asIterable()) {
      double lat = (double) entity.getProperty("lat");
      double lng = (double) entity.getProperty("lng");
      String content = (String) entity.getProperty("content");
      String country = (String) entity.getProperty("country");

      Marker marker = new Marker(lat, lng, content, country);
      markers.add(marker);
    }
    return markers;
  }
}
