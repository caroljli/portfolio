package com.google.sps.data;

/** Represents a marker on the map. */
public class Marker {

  private final double lat;
  private final double lng;
  private final String content;
  private final String country;

  public Marker(double lat, double lng, String content, String country) {
    this.lat = lat;
    this.lng = lng;
    this.content = content;
    this.country = country;
  }

  public double getLat() {
    return lat;
  }

  public double getLng() {
    return lng;
  }

  public String getContent() {
    return content;
  }

  public String getCountry() {
    return country;
  }
}
