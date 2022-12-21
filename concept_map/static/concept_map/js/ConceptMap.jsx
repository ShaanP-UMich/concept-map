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
            myDiagram: this.createConceptMap([], [])
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
                <div id="allSampleContent" className="p-4 w-full">
                    <div id="myDiagramDiv">
                        <canvas tabIndex="0">This
                            text is displayed if your browser does not support the Canvas HTML element.</canvas>
                        <div id="under-canvas-1">
                            <div id="under-canvas-2"></div>
                        </div>
                    </div>
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

        // define each Node's appearance
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",  // the whole node panel
                { locationSpot: go.Spot.Center },
                // define the node's outer shape, which will surround the TextBlock
                $(go.Shape, "Rectangle",
                    { fill: $(go.Brush, "Linear", { 0: "rgb(210, 247, 247)" }), stroke: "black" }),
                $(go.TextBlock,
                    { font: "bold 18pt helvetica, bold arial, sans-serif", margin: 10 },
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

        return myDiagram;
    }

    updateConceptMap(nodeDataArray, linkDataArray) {
        const { myDiagram } = this.state;

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