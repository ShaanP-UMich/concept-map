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
            addNodeCategory_value: "Start",
            deleteNode_value: 1,
            myDiagram: "",
            categories: []
        };

        this.fetchNodes = this.fetchNodes.bind(this);
        this.createConceptMap = this.createConceptMap.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.updateNodeInteractables = this.updateNodeInteractables.bind(this);
        this.getNodeInteractables = this.getNodeInteractables.bind(this);
        this.handleAddNode = this.handleAddNode.bind(this);
        this.handleAddNodeChange = this.handleAddNodeChange.bind(this);
        this.handleAddNodeCategoryChange = this.handleAddNodeCategoryChange.bind(this);
        this.handleDeleteNode = this.handleDeleteNode.bind(this);
        this.handleDeleteNode2 = this.handleDeleteNode2.bind(this);
        this.handleDeleteNodeChange = this.handleDeleteNodeChange.bind(this);
        this.handleAddRelationship = this.handleAddRelationship.bind(this);
        this.handleRemoveRelationship = this.handleRemoveRelationship.bind(this);

        this.updateConceptMap = this.updateConceptMap.bind(this);
    }

    componentDidMount() {
        console.log("componentDidMount is being called");

        this.setState({
            myDiagram: this.createConceptMap2([], [])
        });

        this.fetchNodes();
    }

    render() { // Called before componentDidMount
        const { node_interactables } = this.state;
        console.log("render is being called");

        return (
            <div>
                <div id="" className="p-4 w-full">
                    <div id="abovePalette">
                        <div id="myPaletteDiv"></div>
                        <div id="myDiagramDiv"></div>
                    </div>
                </div>

                {node_interactables}
            </div>
        );
    }

    handleAddNodeChange(event) {
        this.setState({ addNode_value: event.target.value });
    }

    handleAddNodeCategoryChange(event) {
        this.setState({ addNodeCategory_value: event.target.value });
    }

    handleAddNode(event) {
        event.preventDefault();
        const { addNode_value, addNodeCategory_value, csrftoken } = this.state;
        const payload = { node_text: addNode_value, category: addNodeCategory_value };

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

    handleDeleteNode2(node_id) {
        const { csrftoken } = this.state;
        console.log(node_id);

        const payload = { node: node_id };

        fetch('/concept_map/node/delete/', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify(payload)
        }).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).catch((error) => console.log(error));
    }

    handleDeleteNodeChange(event) {
        this.setState({ deleteNode_value: event.target.value });
    }

    handleAddRelationship(from_n, to_n) {
        const { csrftoken } = this.state;
        const payload = { from_node: from_n, to_node: to_n };

        fetch('/concept_map/node/relate/', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify(payload)
        }).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).catch((error) => console.log(error));
    }

    handleRemoveRelationship(from_n, to_n) {
        const { csrftoken } = this.state;
        const payload = { from_node: from_n, to_node: to_n };

        fetch('/concept_map/node/unrelate/', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify(payload)
        }).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).catch((error) => console.log(error));
    }

    fetchNodes() {
        fetch('/concept_map/node/', { credentials: "same-origin" })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                this.setState((prevState) => {
                    let { nodeDataArray, linkDataArray, node_interactables, categories } = prevState;

                    nodeDataArray = data.nodeDataArray;
                    linkDataArray = data.linkDataArray;

                    this.updateConceptMap(nodeDataArray, linkDataArray);

                    const nodeOptions = nodeDataArray.map((node) => (
                        <option key={node.key} value={node.key}>{node.text}</option>
                    ));

                    const categoryOptions = categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ));

                    node_interactables = this.getNodeInteractables(nodeOptions, categoryOptions);

                    return { nodeDataArray, linkDataArray, node_interactables };
                });
            })
            .catch((error) => console.log(error));
    }

    getNodeInteractables(nodeOptions, categoryOptions) {
        return (
            <div>
                <form onSubmit={this.handleAddNode}>
                    <label htmlFor="node_text">Add Node:</label>
                    <input
                        type="text"
                        id="node_text"
                        placeholder="Node Text"
                        onChange={this.handleAddNodeChange} />
                    <br />
                    <label htmlFor="node_category">Idea Type:</label>
                    <select id="node_category" name="node_category" onChange={this.handleAddNodeCategoryChange}>
                        {categoryOptions}
                    </select>
                    <input type="submit" />
                </form>
                <br />
                <form onSubmit={this.handleDeleteNode}>
                    <label htmlFor="nodes">Delete a Node:</label>
                    <select id="nodes" name="nodes" onChange={this.handleDeleteNodeChange}>
                        {nodeOptions}
                    </select>
                    <input type="submit" />
                </form>
            </div>
        );
    }

    updateNodeInteractables() {
        this.setState((prevState) => {
            let { myDiagram, node_interactables, categories } = prevState;
            if (categories.length === 0) return;
            let nodeDataArray = myDiagram.model.nodeDataArray;

            const nodeOptions = nodeDataArray.map((node) => (
                <option key={node.key} value={node.key}>{node.text}</option>
            ));

            const categoryOptions = categories.map((category) => (
                <option key={category} value={category}>{category}</option>
            ));

            console.log(nodeOptions);
            console.log(categoryOptions);

            node_interactables = this.getNodeInteractables(nodeOptions, categoryOptions);

            return { node_interactables };
        });
    }

    createConceptMap2(nodeDataArray, linkDataArray) {
        // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
        // For details, see https://gojs.net/latest/intro/buildingObjects.html
        const $ = go.GraphObject.make;  // for conciseness in defining templates

        let myDiagram =
            $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                {
                    initialAutoScale: go.Diagram.Uniform,
                    contentAlignment: go.Spot.Center,
                    "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                    "LinkRelinked": showLinkLabel,
                    "undoManager.isEnabled": true,  // enable undo & redo
                    "allowMove": false,
                    layout:
                        // $(go.ForceDirectedLayout,  // automatically spread nodes apart
                        //     { maxIterations: 200, defaultSpringLength: 30, defaultElectricalCharge: 70 })
                        $(go.TreeLayout,  // automatically spread nodes apart
                            {
                                alignment: go.TreeLayout.AlignmentCenterChildren,
                                angle: 90,
                                layerSpacing: 70,
                                layerStyle: go.TreeLayout.LayerUniform
                            })
                });

        // Triggers when Link is created
        myDiagram.addDiagramListener("LinkDrawn", e => {
            const { myDiagram } = this.state;
            let from_node = e.subject.part.data.from;
            let to_node = e.subject.part.data.to;
            console.log("Just drew a new link");
            console.log("from: " + e.subject.part.data.from);
            console.log("to: " + e.subject.part.data.to);

            this.handleAddRelationship(from_node, to_node);
        });

        myDiagram.addDiagramListener("TextEdited", e => {
            console.log("Just edited an existing link");

            let edited_node_obj = e.subject.part;

            console.log(e.subject);
            console.log(e.subject.text); // new text value
            console.log(e.parameter); // old text value

            const { csrftoken } = this.state;
            const payload = { node_id: e.subject.part.key, new_text: e.subject.text };

            fetch('/concept_map/node/edit/', {
                credentials: 'include',
                method: 'POST',
                mode: 'same-origin',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                body: JSON.stringify(payload)
            }).then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            }).then(() => {
                this.updateNodeInteractables();
            }).catch((error) => console.log(error));
        });

        // Triggers when Node is created by dropping it in
        myDiagram.addDiagramListener("ExternalObjectsDropped", e => {
            console.log("Part created");
            e.subject.each((p) => {
                if (!(p instanceof go.Node)) return;

                console.log("Just created a node by dragging");

                let orig_key = p.part.data.key;
                let orig_text = p.part.data.text;
                let category = p.part.data.category;

                let added_node_obj = myDiagram.findNodeForKey(orig_key);

                const { csrftoken } = this.state;
                const payload = { node_text: orig_text, category: category, dragged: true };

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
                    console.log(myDiagram.model.getKeyForNodeData(added_node_obj));
                    myDiagram.model.setKeyForNodeData(added_node_obj.data, data['node_id']);
                    console.log(myDiagram.model.getKeyForNodeData(added_node_obj));

                    this.updateNodeInteractables();
                }).catch((error) => console.log(error));
            });
        });

        // Triggers when Node is deleted
        myDiagram.addDiagramListener("SelectionDeleted", e => {
            e.subject.each((p) => {
                if (!(p instanceof go.Node)) return;

                console.log("Just deleted a node");

                console.log(p.part.data);
                let victim = p.part.data.key;
                this.handleDeleteNode2(victim);
                this.updateNodeInteractables();
            });
        });

        // Triggers when Link is deleted
        myDiagram.addModelChangedListener(e => {
            if (e.change === go.ChangedEvent.Remove && e.propertyName === "linkDataArray") {
                console.log("Just deleted a link");
                console.log("from: " + e.oldValue.from);
                console.log("to: " + e.oldValue.to);

                let from_node = e.oldValue.from;
                let to_node = e.oldValue.to;

                this.handleRemoveRelationship(from_node, to_node);
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

        myDiagram.nodeTemplateMap.add("Idea",  // the default category
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
                // makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                // makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
            ));

        myDiagram.nodeTemplateMap.add("Heading",  // the default category
            $(go.Node, "Table", nodeStyle(),
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        { fill: "#282c34", stroke: "#ddff03", strokeWidth: 3.5 },
                        new go.Binding("figure", "figure")),
                    $(go.TextBlock, textStyle(),
                        {
                            margin: 8,
                            maxSize: new go.Size(300, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true
                        },
                        new go.Binding("text").makeTwoWay())
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                // makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                // makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
            ));

        go.Shape.defineFigureGenerator("Cloud", function (shape, w, h) {
            return new go.Geometry()
                .add(new go.PathFigure(.08034461 * w, .1944299 * h, true)
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .2008615 * w, .05349299 * h, -.09239631 * w, .07836421 * h, .1406031 * w, -.0542823 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .4338609 * w, .074219 * h, .2450511 * w, -.00697547 * h, .3776197 * w, -.01112067 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .6558228 * w, .07004196 * h, .4539471 * w, 0, .6066018 * w, -.02526587 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .8921095 * w, .08370865 * h, .6914277 * w, -.01904177 * h, .8921095 * w, -.01220843 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .9147671 * w, .3194596 * h, 1.036446 * w, .04105738 * h, 1.020377 * w, .3022052 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .9082935 * w, .562044 * h, 1.04448 * w, .360238 * h, .992256 * w, .5219009 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .9212406 * w, .8217117 * h, 1.032337 * w, .5771781 * h, 1.018411 * w, .8120651 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .7592566 * w, .9156953 * h, 1.028411 * w, .9571472 * h, .8556702 * w, 1.052487 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .5101666 * w, .9310455 * h, .7431877 * w, 1.009325 * h, .5624123 * w, 1.021761 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .2609328 * w, .9344623 * h, .4820677 * w, 1.031761 * h, .3030112 * w, 1.002796 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .08034461 * w, .870098 * h, .2329994 * w, 1.01518 * h, .03213784 * w, 1.01518 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .06829292 * w, .6545475 * h, -.02812061 * w, .9032597 * h, -.01205169 * w, .6835638 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .06427569 * w, .4265613 * h, -.01812061 * w, .6089503 * h, -.00606892 * w, .4555777 * h))
                    .add(new go.PathSegment(go.PathSegment.Bezier,
                        .08034461 * w, .1944299 * h, -.01606892 * w, .3892545 * h, -.01205169 * w, .1944299 * h)))
                .setSpots(.1, .1, .9, .9);
        });

        myDiagram.nodeTemplateMap.add("Thought",  // the default category
            $(go.Node, "Table", nodeStyle(),
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",
                    $(go.Shape, "Cloud",
                        { fill: "#282c34", stroke: "#9db8fc", strokeWidth: 3.5 },
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
                // makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                // makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
            ));

        myDiagram.nodeTemplateMap.add("Start",
            $(go.Node, "Table", nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Ellipse",
                        { fill: "#282c34", stroke: "#09d3ac", strokeWidth: 3.5 }),
                    $(go.TextBlock, "Start", textStyle(),
                        {
                            margin: 8,
                            wrap: go.TextBlock.WrapFit,
                            editable: true
                        },
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the top, all output only:
                // makePort("T", go.Spot.Top, go.Spot.TopSide, true, true),
                // makePort("L", go.Spot.Left, go.Spot.Left, true, true),
                // makePort("R", go.Spot.Right, go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
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
                // $(go.Shape,  // the arrowhead
                //     { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
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
        let myPalette = $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
            {
                // Instead of the default animation, use a custom fade-down
                "animationManager.initialAnimationStyle": go.AnimationManager.None,
                "InitialAnimationStarting": animateFadeDown, // Instead, animate with this function
                initialScale: 0.8,

                nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                model: new go.GraphLinksModel([  // specify the contents of the Palette
                    { category: "Start", text: "Concept" },
                    { category: "Heading", text: "Heading" },
                    { category: "Idea", text: "Idea" },
                    { category: "Thought", text: "Thought" },
                ])
            });

        this.setState((prevState) => {
            const { categories } = prevState;

            myPalette.model.nodeDataArray.forEach((node) => {
                // console.log(node.category);
                categories.push(node.category);
            });

            return categories;
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