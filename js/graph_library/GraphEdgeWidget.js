// Xác định MỘT đối tượng cạnh
// Hướng của cạnh là a -> b
// Đặt kiểu trong các thuộc tính.js và các tệp CSS !!!

/*
 * Hằng số cho "loại":
  * EDGE_TYPE_UDE = Cạnh không định hướng
  * EDGE_TYPE_DE = Cạnh hướng
  * EDGE_TYPE_BDE = Cạnh hai chiều
 */

// Đối tượng đánh dấu

markerSvg.append("marker")
          .attr("id", "arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr('refX', ARROW_REFX)
          .attr("markerWidth", ARROW_MARKER_WIDTH)
          .attr("markerHeight", ARROW_MARKER_HEIGHT)
          .attr("orient", "auto")
          .append("path")
              .attr("d", "M0,-5 L10,0 L0,5")
              .attr('fill', ARROW_FILL);

markerSvg.append("marker")
          .attr("id", "backwardArrow")
          .attr("viewBox", "-10 -5 10 10")
          .attr('refX', -1*ARROW_REFX)
          .attr("markerWidth", ARROW_MARKER_WIDTH)
          .attr("markerHeight", ARROW_MARKER_HEIGHT)
          .attr("orient", "auto")
          .append("path")
              .attr("d", "M0,-5 L-10,0 L0,5")
              .attr('fill', ARROW_FILL);

// Đối tượng GraphEdgeWidget
// VIỆC CẦN LÀM: Triển khai tốt hơn trọng số cạnh

var GraphEdgeWidget = function(graphVertexA, graphVertexB, edgeIdNumber, type, weight){
  if(weight == null || isNaN(weight)) weight = 1;

  var self = this;

  var defaultAnimationDuration = 250; // millisecond

  var line;//đưòng nối
  var weightText;
  var weightTextPath;
  var weightTextSpan;

  // var vertexA = graphVertexA.getClassNumber();
  // var vertexB = graphVertexB.getClassNumber();

  var edgeGenerator = d3.svg.line()
                        .x(function(d){return d.x;})
                        .y(function(d){return d.y;})
                        .interpolate("linear");

  var lineCommand = edgeGenerator(calculatePath());
  var initCommand = edgeGenerator([calculatePath()[0],calculatePath()[0]]);

  var attributeList = {
    "path":{
      "id": null,
      "class": null,
      "d": null,
      "stroke": null,
      "stroke-width": null
    },
    "weight":{
      "id": null,
      "startOffset": null,
      "dy": null,
      "fill": null,
      "font-family": null,
      "font-weight": null,
      "font-size": null,
      "text-anchor": null,
      "text": null
    }
  };

  updatePath();
  init();

  this.redraw = function(duration){
    draw(duration);
  }

  this.animateHighlighted = function(duration){
    if(duration == null || isNaN(duration)) duration = defaultAnimationDuration;
    if(duration <= 0) duration = 1;

    edgeSvg.append("path")
          .attr("id", "tempEdge" + line.attr("id"))
          .attr("stroke", graphEdgeProperties["animateHighlightedPath"]["stroke"])
          .attr("stroke-width", graphEdgeProperties["animateHighlightedPath"]["stroke-width"])
          .transition()
          .duration(duration)
          .each("start", function(){
            edgeSvg.select("#tempEdge" + line.attr("id"))
                  .attr("d", initCommand);
          })
          .attr("d", lineCommand)
          .each("end", function(){
            line.attr("stroke", graphEdgeProperties["path"]["highlighted"]["stroke"])
                .attr("stroke-width", graphEdgeProperties["path"]["stroke-width"]);

            edgeSvg.select("#tempEdge" + line.attr("id"))
                  .remove();

            draw(0);
          })
  }
// hiển thị các cạnh
  this.showEdge = function(){
    attributeList["path"]["d"] = lineCommand;
    attributeList["path"]["stroke-width"] = graphEdgeProperties["path"]["stroke-width"];
  }
// ẩn bớt cạnh
  this.hideEdge = function(){
    // attributeList["path"]["stroke-width"] = 0;
    attributeList["path"]["d"] = initCommand;
  }
// hiển thị trọng số
  this.showWeight = function(){
    attributeList["weight"]["font-size"] = graphEdgeProperties["weight"]["font-size"];
  }
?ẩn trọng số
  this.hideWeight = function(){
    attributeList["weight"]["font-size"] = 0;
  }

  // DEPRECATED
  /*
  this.defaultEdge = function(){
    var key;

    for(key in graphEdgeProperties["path"]["default"]){
      attributeList["path"][key] = graphEdgeProperties["path"]["default"][key];
    }

    for(key in graphEdgeProperties["weight"]["default"]){
      attributeList["weight"][key] = graphEdgeProperties["weight"]["default"][key];
    }
  }

  this.highlightEdge = function(){
    var key;

    for(key in graphEdgeProperties["path"]["highlighted"]){
      attributeList["path"][key] = graphEdgeProperties["path"]["highlighted"][key];
    }

     for(key in graphEdgeProperties["weight"]["highlighted"]){
      attributeList["weight"][key] = graphEdgeProperties["weight"]["highlighted"][key];
    }
  }

  this.traversedEdge = function(){
    var key;

    for(key in graphEdgeProperties["path"]["traversed"]){
      attributeList["path"][key] = graphEdgeProperties["path"]["traversed"][key];
    }

     for(key in graphEdgeProperties["weight"]["traversed"]){
      attributeList["weight"][key] = graphEdgeProperties["weight"]["traversed"][key];
    }
  }
  */

  this.stateEdge = function(stateName){
    var key;

    for(key in graphEdgeProperties["path"][stateName]){
      attributeList["path"][key] = graphEdgeProperties["path"][stateName][key];
    }

     for(key in graphEdgeProperties["weight"][stateName]){
      attributeList["weight"][key] = graphEdgeProperties["weight"][stateName][key];
    }
  }

  // Loại bỏ cạnh (không có hoạt ảnh)
   // Nếu bạn muốn hoạt ảnh, hãy ẩn & vẽ lại cạnh trước, sau đó gọi hàm này
  this.removeEdge = function(){
    graphVertexA.removeEdge(self);
    graphVertexB.removeEdge(self);

    line.remove();
    weightText.remove();
  }
// biểu diễn lại đường dẫn
  this.refreshPath = function(){
    var tempInit = initCommand;

    updatePath();

    if(attributeList["path"]["d"] == tempInit) attributeList["path"]["d"] = initCommand;
    else attributeList["path"]["d"] = lineCommand;
  }
// thay đổi đỉnh A
  this.changeVertexA = function(newGraphVertexA){
    var edgeDrawn = false;

    if(attributeList["path"]["d"] == lineCommand) edgeDrawn = true;

    graphVertexA.removeEdge(self);
    graphVertexA = newGraphVertexA;
    // vertexA =  graphVertexA.getClassNumber();

    updatePath();

    lineCommand = edgeGenerator(calculatePath());
    initCommand = edgeGenerator([calculatePath()[0]]);
    
    attributeList["path"]["d"] = initCommand;

    graphVertexA.addEdge(self);

    if(edgeDrawn) attributeList["path"]["d"] = lineCommand;
  }
// thay đổi đỉnh B
  this.changeVertexB = function(newGraphVertexB){
    var edgeDrawn = false;

    if(attributeList["path"]["d"] == lineCommand) edgeDrawn = true;

    graphVertexB.removeEdge(self);
    graphVertexB = newGraphVertexB;
    // vertexB =  graphVertexB.getClassNumber();

    updatePath();

    lineCommand = edgeGenerator(calculatePath());
    initCommand = edgeGenerator([calculatePath()[0]]);
    
    attributeList["path"]["d"] = initCommand;

    graphVertexB.addEdge(self);

    if(edgeDrawn) attributeList["path"]["d"] = lineCommand;
  }
// thay đổi kiểu 
  this.changeType = function(newType){
    type = newType;

    switch(type){
      case EDGE_TYPE_UDE:
        attributeList["path"]["class"] = "ude";
        break;
      case EDGE_TYPE_DE:
        attributeList["path"]["class"] = "de";
        break;
      case EDGE_TYPE_BDE:
        attributeList["path"]["class"] = "bde";
        break;
      default:
        break;
    }
  }
// thay đổi trọng số
  this.changeWeight = function(newWeight){
    weight = newWeight;
    attributeList["weight"]["text"] = weight;
  }
// lấy đỉnh
  this.getVertex = function(){
    return [graphVertexA, graphVertexB];
  }
// lấy thuộc tính
  this.getAttributes = function(){
    return deepCopy(attributeList["path"]);
  }
//trả lại loại cạnh 
  this.getType = function(){
    return type;
  }

  // Chức năng của người trợ giúp

  function init(){
    attributeList["path"]["id"] = "e" + edgeIdNumber;
    attributeList["path"]["d"] = initCommand;
    attributeList["path"]["stroke"] = graphEdgeProperties["path"]["default"]["stroke"];
    attributeList["path"]["stroke-width"] = graphEdgeProperties["path"]["default"]["stroke-width"];

    switch(type){
      case EDGE_TYPE_UDE:
        attributeList["path"]["class"] = "ude";
        break;
      case EDGE_TYPE_DE:
        attributeList["path"]["class"] = "de";
        break;
      case EDGE_TYPE_BDE:
        attributeList["path"]["class"] = "bde";
        break;
      default:
        break;
    }

    attributeList["weight"]["id"] = "ew" + edgeIdNumber;
    attributeList["weight"]["startOffset"] = graphEdgeProperties["weight"]["default"]["startOffset"];
    attributeList["weight"]["dy"] = graphEdgeProperties["weight"]["default"]["dy"];
    attributeList["weight"]["fill"] = graphEdgeProperties["weight"]["default"]["fill"];
    attributeList["weight"]["font-family"] = graphEdgeProperties["weight"]["default"]["font-family"];
    attributeList["weight"]["font-size"] = 0;
    attributeList["weight"]["font-weight"] = graphEdgeProperties["weight"]["default"]["font-weight"];
    attributeList["weight"]["text-anchor"] = graphEdgeProperties["weight"]["default"]["text-anchor"];
    attributeList["weight"]["text"] = weight;

    line = edgeSvg.append("path");

    line.attr("id", attributeList["path"]["id"])
        .attr("class", attributeList["path"]["class"]);

    try {
    if (attributeList["path"]["d"] != "MNaN,NaNLNaN,NaN")
    line.attr("d", attributeList["path"]["d"])
        .attr("stroke", attributeList["path"]["stroke"])
        .attr("stroke-width", attributeList["path"]["stroke-width"]);
    } catch(err) {}
    weightText = edgeWeightSvg.append("text");

    weightText.attr("id", attributeList["weight"]["id"]);

    weightText.attr("fill", attributeList["weight"]["fill"])
              .attr("font-family", attributeList["weight"]["font-family"])
              .attr("font-size", attributeList["weight"]["font-size"])
              //.attr("font-size", 16)
              .attr("font-weight", attributeList["weight"]["font-weight"])
              .attr("text-anchor", attributeList["weight"]["text-anchor"]);

    weightTextPath = weightText.append("textPath")
                              .attr("xlink:href", function(){
                                return "#" + attributeList["path"]["id"];
                              })
                              .attr("startOffset", attributeList["weight"]["startOffset"]);

    weightTextSpan = weightTextPath.append("tspan")
                                  .attr("dy", attributeList["weight"]["dy"])
                                  .text(function(){
                                    return attributeList["weight"]["text"];
                                  });
  }
// thay đổi tọa độ x của đỉnh A
  function cxA(){
    if (graphVertexA)
      return parseFloat(graphVertexA.getAttributes()["outerVertex"]["cx"]);
  }
// thay đổi tọa độ y của đỉnh A
  function cyA(){
    if (graphVertexA)
      return parseFloat(graphVertexA.getAttributes()["outerVertex"]["cy"]);
  }
// thay đổi bán kính đỉnh A
  function rA(){
    if (graphVertexA)
      return parseFloat(graphVertexA.getAttributes()["outerVertex"]["r"]);
  }
// thay đổi tọa độ x của đỉnh b
  function cxB(){
    if (graphVertexA)
      return parseFloat(graphVertexB.getAttributes()["outerVertex"]["cx"]);
  }
// thay đổi tọa độ y của đỉnh B
  function cyB(){
    if (graphVertexA)
      return parseFloat(graphVertexB.getAttributes()["outerVertex"]["cy"]);
  }
// thay đổi bán kính đỉnh A
  function rB(){
    if (graphVertexA)
      return parseFloat(graphVertexB.getAttributes()["outerVertex"]["r"]);
  }

// tính toán đường dẫn
  function calculatePath(){
    var x1 = cxA(), y1 = cyA();
    var x2 = cxB(), y2 = cyB();
    
    var pts = getVertexLineIntersectionPoint(x1, y1, x2, y2, rA(), x1, y1);
    var pts2 = getVertexLineIntersectionPoint(x1, y1, x2, y2, rB(), x2, y2);
    var min = 5000;
    var save1 = 0, save2 = 0;
    for (var i=1; i<=3; i+=2) 
      for (var j=1; j<=3; j+=2) 
    {
      var d = Math.sqrt((pts[i-1]-pts2[j-1])*(pts[i-1]-pts2[j-1]) + (pts[i] - pts2[j])*(pts[i] - pts2[j]));
      if (d < min) {
        min = d;
        save1 = i; save2 = j;
      }
    }
    
    var beginPoint = {"x": pts[save1-1], "y": pts[save1]};
    var endPoint = {"x": pts2[save2-1], "y": pts2[save2]};
  
    return [beginPoint, endPoint];
  }
  // lấy Điểm giao nhau của đường nối đỉnh
  function getVertexLineIntersectionPoint(x1, y1, x2, y2, r, cx, cy) {
    var baX = x2 - x1; //pointB.x - pointA.x;
    var baY = y2 - y1; //pointB.y - pointA.y;
    var caX = cx - x1; //center.x - pointA.x;
    var caY = cy - y1; //center.y - pointA.y;

    var a = baX * baX + baY * baY;
    var bBy2 = baX * caX + baY * caY;
    var c = caX * caX + caY * caY - r * r;

    var pBy2 = bBy2 / a;
    var q = c / a;
    
    var disc = pBy2 * pBy2 - q;
    var tmpSqrt = Math.sqrt(disc);
    var abScalingFactor1 = -pBy2 + tmpSqrt;
    var abScalingFactor2 = -pBy2 - tmpSqrt;

    var r_x1 = x1 - baX * abScalingFactor1;
    var r_y1 = y1 - baY * abScalingFactor1
    //Point p1 = new Point(pointA.x - baX * abScalingFactor1, pointA.y
    //      - baY * abScalingFactor1);
    var r_x2 = x1 - baX * abScalingFactor2;
    var r_y2 = y1 - baY * abScalingFactor2

    //Point p2 = new Point(pointA.x - baX * abScalingFactor2, pointA.y
    //       - baY * abScalingFactor2);
    var res = new Array();
    res[0] = r_x1; 
    res[1] = r_y1;
    res[2] = r_x2;
    res[3] = r_y2 ;
    return res;
  }
// vẽ cạnh
  function draw(dur){
    if(dur == null || isNaN(dur)) dur = defaultAnimationDuration;
    if(dur <= 0) dur = 1;

    line.attr("class", attributeList["path"]["class"]);

    line.transition()
        .duration(dur)
        .attr("d", attributeList["path"]["d"])
        .attr("stroke", attributeList["path"]["stroke"])
        .attr("stroke-width", attributeList["path"]["stroke-width"])
        .style("marker-start", function(){
          if(attributeList["path"]["d"] == initCommand) return null;
          if(attributeList["path"]["class"] == "bde") return "url(#backwardArrow)";
          return null;
        })
        .style("marker-end", function(){
          if(attributeList["path"]["d"] == initCommand) return null;
          if(attributeList["path"]["class"] == "de" || attributeList["path"]["class"] == "bde") return "url(#arrow)";
          return null;
        });

    weightText.transition()
              .duration(dur)
              .attr("fill", attributeList["weight"]["fill"])
              .attr("font-family", attributeList["weight"]["font-family"])
              .attr("font-size", attributeList["weight"]["font-size"])
              .attr("font-weight", attributeList["weight"]["font-weight"])
              .attr("text-anchor", attributeList["weight"]["text-anchor"]);
              
    weightTextSpan.transition()
                  .duration(dur)
                  .text(function(){
                    return attributeList["weight"]["text"];
                  });
  }
// cập nhật đường dẫn
  function updatePath(){
    lineCommand = edgeGenerator(calculatePath());
    initCommand = edgeGenerator([calculatePath()[0],calculatePath()[0]]);
  }
}