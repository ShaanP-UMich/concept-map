import React from "react";
import PropTypes from "prop-types";

class ConceptMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nodeDataArray: {},
            linkDataArray: {},
            csrftoken: this.getCookie('csrftoken'),
            node_interactables: (<div></div>),
            addNode_value: "",
            deleteNode_value: 1,
            myDiagram: ""
        };

        this.fetchNodes = this.fetchNodes.bind(this);
        this.createConceptMap = this.createConceptMap.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.handleAddNode = this.handleAddNode.bind(this);
        this.handleAddNodeChange = this.handleAddNodeChange.bind(this);
        this.handleDeleteNode = this.handleDeleteNode.bind(this);
        this.handleDeleteNodeChange = this.handleDeleteNodeChange.bind(this);

        this.updateConceptMap = this.updateConceptMap.bind(this);
    }

    componentDidMount() {
        console.log("componentDidMount is being called");

        this.setState({
            // myDiagram: this.createConceptMap([], [])
            myDiagram: this.createConceptMap2([], [])
        });

        this.fetchNodes();
    }

    render() { // Called before componentDidMount
        const { nodeDataArray, node_interactables } = this.state;
        console.log("render is being called");

        // console.log(nodeDataArray);
        // console.log(node_interactables);

        return (
            <div>
                <div id="" className="p-4 w-full">
                    <div id="abovePalette">
                        <div id="myPaletteDiv"></div>
                        <div id="myDiagramDiv"></div>
                    </div>
                    {/* <div id="myDiagramDiv">
                        <canvas tabIndex="0">This
                            text is displayed if your browser does not support the Canvas HTML element.</canvas>
                        <div id="under-canvas-1">
                            <div id="under-canvas-2"></div>
                        </div>
                    </div> */}
                </div>

                {node_interactables}
            </div>
        );
    }

    handleAddNodeChange(event) {
        this.setState({ addNode_value: event.target.value });
    }

    handleAddNode(event) {
        // console.log(event.target[0].value); // this is the node_text from the form (old)
        event.preventDefault();
        const { addNode_value, csrftoken } = this.state;
        const payload = { node_text: addNode_value }
        // console.log(addNode_value);
        // console.log(csrftoken);

        fetch('/concept_map/node/add/', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify(payload)
        }).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).then((data) => {
            this.fetchNodes();
        }).catch((error) => console.log(error));

        event.target.children[1].value = "";
        this.setState({ addNode_value: "" });
    }

    handleDeleteNode(event) {
        event.preventDefault();

        const { deleteNode_value, csrftoken } = this.state;
        console.log(deleteNode_value);

        const payload = { node: deleteNode_value };

        fetch('/concept_map/node/delete/', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify(payload)
        }).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).then((data) => {
            this.fetchNodes();
        }).catch((error) => console.log(error));

        event.target.children[1].value = 1;
        this.setState({ deleteNode_value: 1 });
    }

    handleDeleteNodeChange(event) {
        // console.log(event.target.value);
        this.setState({ deleteNode_value: event.target.value });
    }

    fetchNodes() {
        fetch('/concept_map/node/', { credentials: "same-origin" })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                this.setState((prevState) => {
                    let { nodeDataArray, linkDataArray, node_interactables, addNode_value,
                        deleteNode_value } = prevState;
                    // console.log("this inner setState is running");

                    nodeDataArray = data.nodeDataArray;
                    linkDataArray = data.linkDataArray;

                    // linkDataArray.push({ from: 31, to: 32 });

                    this.updateConceptMap(nodeDataArray, linkDataArray);

                    const nodeOptions = nodeDataArray.map((node) => (
                        <option key={node.key} value={node.key}>{node.text}</option>
                    ));

                    node_interactables = (
                        <div>
                            <form onSubmit={this.handleAddNode}>
                                <label htmlFor="node_text">Add Node:</label>
                                <input
                                    type="text"
                                    id="node_text"
                                    placeholder="Node Text"
                                    onChange={this.handleAddNodeChange} />
                            </form>

                            <form onSubmit={this.handleDeleteNode}>
                                <label htmlFor="nodes">Delete a Node:</label>
                                <select id="nodes" name="nodes" onChange={this.handleDeleteNodeChange}>
                                    {nodeOptions}
                                </select>
                                <input type="submit" />
                            </form>
                        </div>
                    );

                    return { nodeDataArray, linkDataArray, node_interactables };
                });
            })
            .catch((error) => console.log(error));
    }

    createConceptMap2(nodeDataArray, linkDataArray) {
        if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this

        // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
        // For details, see https://gojs.net/latest/intro/buildingObjects.html
        const $ = go.GraphObject.make;  // for conciseness in defining templates

        let myDiagram =
            $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                {
                    initialAutoScale: go.Diagram.Uniform,
                    "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                    "LinkRelinked": showLinkLabel,
                    "undoManager.isEnabled": true,  // enable undo & redo
                    layout:
                        $(go.ForceDirectedLayout,  // automatically spread nodes apart
                            { maxIterations: 200, defaultSpringLength: 10, defaultElectricalCharge: 50 })
                });

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener("Modified", e => {
            console.log("Just modified the diagram");
            // console.log(e);
        });

        myDiagram.addDiagramListener("LinkDrawn", e => {
            console.log("Just drew a new link");
            console.log("from:");
            console.log(e.subject.part.data.from);
            console.log("to:");
            console.log(e.subject.part.data.to);
            // console.log(e);
        });

        myDiagram.addModelChangedListener(e => {
            if (e.change === go.ChangedEvent.Remove && e.propertyName === "linkDataArray") {
                // console.log(e.toString());
                console.log("Just deleted a link");
                console.log("from: " + e.oldValue.from);
                console.log("to: " + e.oldValue.to);
            }
        });

        // helper definitions for node templates

        function nodeStyle() {
            return [
                // The Node.location comes from the "loc" property of the node data,
                // converted by the Point.parse static method.
                // If the Node.location is changed, it updates the "loc" property of the node data,
                // converting back using the Point.stringify static method.
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    // the Node.location is at the center of each node
                    locationSpot: go.Spot.Center
                }
            ];
        }

        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId,
        // the "align" is used to determine where to position the port relative to the body of the node,
        // the "spot" is used to control how links connect with the port and whether the port
        // stretches along the side of the node,
        // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
        function makePort(name, align, spot, output, input) {
            var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
            // the port is basically just a transparent rectangle that stretches along the side of the node,
            // and becomes colored when the mouse passes over it
            return $(go.Shape,
                {
                    fill: "transparent",  // changed to a color in the mouseEnter event handler
                    strokeWidth: 0,  // no stroke
                    width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
                    height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
                    alignment: align,  // align the port on the main Shape
                    stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output,  // declare whether the user may draw links from here
                    toSpot: spot,  // declare where links may connect at this port
                    toLinkable: input,  // declare whether the user may draw links to here
                    cursor: "pointer",  // show a different cursor to indicate potential link point
                    mouseEnter: (e, port) => {  // the PORT argument will be this Shape
                        if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                    },
                    mouseLeave: (e, port) => port.fill = "transparent"
                });
        }

        function textStyle() {
            return {
                font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
                stroke: "#F8F8F8"
            }
        }

        // define the Node templates for regular nodes

        myDiagram.nodeTemplateMap.add("",  // the default category
            $(go.Node, "Table", nodeStyle(),
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                        new go.Binding("figure", "figure")),
                    $(go.TextBlock, textStyle(),
                        {
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true
                        },
                        new go.Binding("text").makeTwoWay())
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
            ));

        myDiagram.nodeTemplateMap.add("Conditional",
            $(go.Node, "Table", nodeStyle(),
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",
                    $(go.Shape, "Diamond",
                        { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                        new go.Binding("figure", "figure")),
                    $(go.TextBlock, textStyle(),
                        {
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true
                        },
                        new go.Binding("text").makeTwoWay())
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
            ));

        myDiagram.nodeTemplateMap.add("Start",
            $(go.Node, "Table", nodeStyle(),
                $(go.Panel, "Spot",
                    $(go.Shape, "Circle",
                        { desiredSize: new go.Size(70, 70), fill: "#282c34", stroke: "#09d3ac", strokeWidth: 3.5 }),
                    $(go.TextBlock, "Start", textStyle(),
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the top, all output only:
                makePort("L", go.Spot.Left, go.Spot.Left, true, false),
                makePort("R", go.Spot.Right, go.Spot.Right, true, false),
                makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
            ));

        myDiagram.nodeTemplateMap.add("End",
            $(go.Node, "Table", nodeStyle(),
                $(go.Panel, "Spot",
                    $(go.Shape, "Circle",
                        { desiredSize: new go.Size(60, 60), fill: "#282c34", stroke: "#DC3C00", strokeWidth: 3.5 }),
                    $(go.TextBlock, "End", textStyle(),
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the bottom, all input only:
                makePort("T", go.Spot.Top, go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, go.Spot.Left, false, true),
                makePort("R", go.Spot.Right, go.Spot.Right, false, true)
            ));

        // taken from ../extensions/Figures.js:
        go.Shape.defineFigureGenerator("File", (shape, w, h) => {
            var geo = new go.Geometry();
            var fig = new go.PathFigure(0, 0, true); // starting point
            geo.add(fig);
            fig.add(new go.PathSegment(go.PathSegment.Line, .75 * w, 0));
            fig.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
            fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
            fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
            var fig2 = new go.PathFigure(.75 * w, 0, false);
            geo.add(fig2);
            // The Fold
            fig2.add(new go.PathSegment(go.PathSegment.Line, .75 * w, .25 * h));
            fig2.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
            geo.spot1 = new go.Spot(0, .25);
            geo.spot2 = go.Spot.BottomRight;
            return geo;
        });

        myDiagram.nodeTemplateMap.add("Comment",
            $(go.Node, "Auto", nodeStyle(),
                $(go.Shape, "File",
                    { fill: "#282c34", stroke: "#DEE0A3", strokeWidth: 3 }),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(200, NaN),
                        wrap: go.TextBlock.WrapFit,
                        textAlign: "center",
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
                // no ports, because no links are allowed to connect with a comment
            ));


        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5, toShortLength: 4,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    resegmentable: true,
                    // mouse-overs subtly highlight links:
                    mouseEnter: (e, link) => link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)",
                    mouseLeave: (e, link) => link.findObject("HIGHLIGHT").stroke = "transparent",
                    selectionAdorned: false
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape,  // the highlight shape, normally transparent
                    { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
                $(go.Shape,  // the link path shape
                    { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
                    new go.Binding("stroke", "isSelected", sel => sel ? "dodgerblue" : "gray").ofObject()),
                $(go.Shape,  // the arrowhead
                    { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
                $(go.Panel, "Auto",  // the link label, normally not visible
                    { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                    new go.Binding("visible", "visible").makeTwoWay(),
                    $(go.Shape, "RoundedRectangle",  // the label shape
                        { fill: "#F8F8F8", strokeWidth: 0 }),
                    $(go.TextBlock, "Yes",  // the label
                        {
                            textAlign: "center",
                            font: "10pt helvetica, arial, sans-serif",
                            stroke: "#333333",
                            editable: true
                        },
                        new go.Binding("text").makeTwoWay())
                )
            );

        // Make link labels visible if coming out of a "conditional" node.
        // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
        function showLinkLabel(e) {
            var label = e.subject.findObject("LABEL");
            if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
        }

        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

        // load();  // load an initial diagram from some JSON text

        // initialize the Palette that is on the left side of the page
        let myPalette =
            $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
                {
                    // Instead of the default animation, use a custom fade-down
                    "animationManager.initialAnimationStyle": go.AnimationManager.None,
                    "InitialAnimationStarting": animateFadeDown, // Instead, animate with this function

                    nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                    model: new go.GraphLinksModel([  // specify the contents of the Palette
                        { category: "Start", text: "Start" },
                        { text: "Step" },
                        { category: "Conditional", text: "???" },
                        { category: "End", text: "End" },
                        { category: "Comment", text: "Comment" }
                    ])
                });

        // This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
        function animateFadeDown(e) {
            var diagram = e.diagram;
            var animation = new go.Animation();
            animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
            animation.easing = go.Animation.EaseOutExpo;
            animation.duration = 900;
            // Fade "down", in other words, fade in from above
            animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
            animation.add(diagram, 'opacity', 0, 1);
            animation.start();
        }

        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        myDiagram.model.linkFromPortIdProperty = "fromPort";
        myDiagram.model.linkToPortIdProperty = "toPort";

        return myDiagram;

    } // end init

    createConceptMap(nodeDataArray, linkDataArray) {
        console.log("createConceptMap is running...");
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

        myDiagram.nodeTemplateMap.add("",
            $(go.Node, "Auto",  // the whole node panel
                { locationSpot: go.Spot.Center },
                // define the node's outer shape, which will surround the TextBlock
                $(go.Shape, "Rectangle",
                    { fill: $(go.Brush, "Linear", { 0: "rgb(210, 247, 247)" }), stroke: "black" }),
                $(go.TextBlock,
                    { font: "bold 18pt helvetica, bold arial, sans-serif", margin: 10 },
                    new go.Binding("text", "text"))
            ));

        myDiagram.nodeTemplateMap.add("Main",
            $(go.Node, "Auto",  // the whole node panel
                { locationSpot: go.Spot.Center },
                // define the node's outer shape, which will surround the TextBlock
                $(go.Shape, "Circle",
                    { fill: $(go.Brush, "Linear", { 0: "rgb(210, 247, 247)" }), stroke: "black" }),
                $(go.TextBlock,
                    { font: "bold 18pt helvetica, bold arial, sans-serif", margin: 10 },
                    new go.Binding("text", "text"))
            ));

        // define each Node's appearance
        // myDiagram.nodeTemplate =
        //     $(go.Node, "Auto",  // the whole node panel
        //         { locationSpot: go.Spot.Center },
        //         // define the node's outer shape, which will surround the TextBlock
        //         $(go.Shape, "Rectangle",
        //             { fill: $(go.Brush, "Linear", { 0: "rgb(210, 247, 247)" }), stroke: "black" }),
        //         $(go.TextBlock,
        //             { font: "bold 18pt helvetica, bold arial, sans-serif", margin: 10 },
        //             new go.Binding("text", "text"))
        //     );

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

        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

        return myDiagram;
    }

    updateConceptMap(nodeDataArray, linkDataArray) {
        const { myDiagram } = this.state;

        // myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        // myDiagram.model.nodeDataArray = nodeDataArray;
        // myDiagram.model.linkDataArray = linkDataArray;

        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        myDiagram.model.linkFromPortIdProperty = "fromPort";
        myDiagram.model.linkToPortIdProperty = "toPort";
    }

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

export default ConceptMap;