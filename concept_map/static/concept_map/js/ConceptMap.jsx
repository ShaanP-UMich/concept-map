import React from "react";
import PropTypes from "prop-types";

class ConceptMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nodeDataArray: {},
            linkDataArray: {},
            csrftoken: this.getCookie('csrftoken'),
            addNode_value: ""
        };

        this.createConceptMap = this.createConceptMap.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.handleAddNode = this.handleAddNode.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch('/concept_map/node/', { credentials: "same-origin" })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                this.setState((prevState) => {
                    let { nodeDataArray, linkDataArray } = prevState;

                    nodeDataArray = data.nodeDataArray;
                    linkDataArray = data.linkDataArray;

                    this.createConceptMap(nodeDataArray, linkDataArray);
                });
            })
            .catch((error) => console.log(error));
    }

    render() { // Called before componentDidMount
        const { addNode_value } = this.state;
        return (
            <div>
                <div id="allSampleContent" className="p-4 w-full">
                    <div id="myDiagramDiv">
                        <canvas tabIndex="0">This
                            text is displayed if your browser does not support the Canvas HTML element.</canvas>
                        <div id="under-canvas-1">
                            <div id="under-canvas-2"></div>
                        </div>
                    </div>
                </div>

                <form onSubmit={this.handleAddNode}>
                    <label htmlFor="node_text">Add Node:</label>
                    <input
                        type="text"
                        value={addNode_value}
                        id="node_text"
                        placeholder="Node Text"
                        onChange={this.handleChange} />
                </form>

                {/* <form action="/concept_map/node/add/" method="post" id="add_node_form">
                    <CSRFToken />
                    <label htmlFor="node_text">Add Node:</label>
                    <input type="text" id="node_text" name="node_text" placeholder="text" />
                </form>
                <button type="submit" form="add_node_form" value="Submit">Add Node</button> */}
            </div>
        );
    }

    handleChange(event) {
        this.setState({ addNode_value: event.target.value });
    }

    handleAddNode(event) {
        event.preventDefault()
        // console.log(event.target[0].value); // this is the node_text from the form

        const { addNode_value, csrftoken } = this.state;
        const payload = { node_text: addNode_value }
        console.log(addNode_value);
        console.log(csrftoken);

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
            console.log("got back" + data.node_text);
        }).catch((error) => console.log(error));

        this.setState({ addNode_value: "" });
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

        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
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