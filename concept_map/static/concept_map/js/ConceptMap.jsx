import React from "react";
import PropTypes from "prop-types";

class ConceptMap extends React.Component {
    constructor(props) {
        super(props);

        this.createConceptMap = this.createConceptMap.bind(this);
    }

    componentDidMount() {
        let nodeDataArray = [
            // { key: 1, text: "Concept Maps" },
            // { key: 2, text: "Organized Knowledge" },
            { key: 1, text: "Climate Change" },
            { key: 2, text: "Evidence" },
            { key: 3, text: "Solutions" },
            { key: 4, text: "Causes" },
            { key: 5, text: "human activities" },
            { key: 6, text: "natural environmental changes" },
            { key: 7, text: "change human behavior" },
            { key: 8, text: "reduce burning of fossil fuels" },
            { key: 9, text: "explore renewable energy sources" },
            { key: 10, text: "furthur research" },
            { key: 11, text: "warming oceans" },
            { key: 12, text: "increase in extreme weather" },
            { key: 13, text: "melting glaciers" },
        ];

        let linkDataArray = [
            // { from: 1, to: 2, text: "represent" },
            // { from: 2, to: 3, text: "is" },
            { from: 1, to: 2 },
            { from: 1, to: 4 },
            { from: 1, to: 3 },

            { from: 2, to: 11 },
            { from: 2, to: 12 },
            { from: 2, to: 13 },

            { from: 4, to: 5 },
            { from: 4, to: 6 },

            { from: 3, to: 10 },
            { from: 3, to: 7 },
            { from: 7, to: 8 },
            { from: 7, to: 9 },
        ];

        this.createConceptMap(nodeDataArray, linkDataArray);
    }

    render() {
        return (
            <div id="allSampleContent" className="p-4 w-full">
                <div id="myDiagramDiv">
                    <canvas tabIndex="0">This
                        text is displayed if your browser does not support the Canvas HTML element.</canvas>
                    <div id="under-canvas-1">
                        <div id="under-canvas-2"></div>
                    </div>
                </div>
            </div >
        );
    }

    createConceptMap(nodeDataArray, linkDataArray) {
        // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
        // For details, see https://gojs.net/latest/intro/buildingObjects.html
        const $ = go.GraphObject.make;  // for conciseness in defining templates

        let myDiagram =
            $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                {
                    initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
                    contentAlignment: go.Spot.Center,  // align document to the center of the viewport
                    layout:
                        $(go.ForceDirectedLayout,  // automatically spread nodes apart
                            { maxIterations: 200, defaultSpringLength: 30, defaultElectricalCharge: 100 })
                });

        // define each Node's appearance
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",  // the whole node panel
                { locationSpot: go.Spot.Center },
                // define the node's outer shape, which will surround the TextBlock
                $(go.Shape, "Rectangle",
                    { fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }), stroke: "black" }),
                $(go.TextBlock,
                    { font: "bold 10pt helvetica, bold arial, sans-serif", margin: 4 },
                    new go.Binding("text", "text"))
            );

        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
                $(go.Shape,  // the link shape
                    { stroke: "black" }),
                $(go.Shape,  // the arrowhead
                    { toArrow: "standard", stroke: null }),
                $(go.Panel, "Auto",
                    $(go.Shape,  // the label background, which becomes transparent around the edges
                        {
                            fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                            stroke: null
                        }),
                    $(go.TextBlock,  // the label text
                        {
                            textAlign: "center",
                            font: "10pt helvetica, arial, sans-serif",
                            stroke: "#555555",
                            margin: 4
                        },
                        new go.Binding("text", "text"))
                )
            );

        // create the model for the concept map
        // var nodeDataArray = [
        //     // { key: 1, text: "Concept Maps" },
        //     // { key: 2, text: "Organized Knowledge" },
        //     { key: 1, text: "Climate Change" },
        //     { key: 2, text: "Evidence" },
        //     { key: 3, text: "Solutions" },
        //     { key: 4, text: "Causes" },
        //     { key: 5, text: "human activities" },
        //     { key: 6, text: "natural environmental changes" },
        //     { key: 7, text: "change human behavior" },
        //     { key: 8, text: "reduce burning of fossil fuels" },
        //     { key: 9, text: "explore renewable energy sources" },
        //     { key: 10, text: "furthur research" },
        //     { key: 11, text: "warming oceans" },
        //     { key: 12, text: "increase in extreme weather" },
        //     { key: 13, text: "melting glaciers" },
        // ];
        // var linkDataArray = [
        //     // { from: 1, to: 2, text: "represent" },
        //     // { from: 2, to: 3, text: "is" },
        //     { from: 1, to: 2 },
        //     { from: 1, to: 4 },
        //     { from: 1, to: 3 },

        //     { from: 2, to: 11 },
        //     { from: 2, to: 12 },
        //     { from: 2, to: 13 },

        //     { from: 4, to: 5 },
        //     { from: 4, to: 6 },

        //     { from: 3, to: 10 },
        //     { from: 3, to: 7 },
        //     { from: 7, to: 8 },
        //     { from: 7, to: 9 },
        // ];
        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    }
}

export default ConceptMap;