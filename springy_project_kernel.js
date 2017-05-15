/** used in the "for" loops: */
var i, j;

/**This function searches the nodes of a Springy.Graph and returns the id of the node with the given label. */
function findNodeId(label, graph){
    var node_id = -1;
    var count = 0;
    while (count < graph.nodes.length){
        if(label === graph.nodes[count].data.label){
            node_id = count;
            break;
        } else { count++; }
    };
    return node_id;
};

/** takes a variables number of Springy.Graphs as input to calculate their intersection.*/
function computeIntersectionRecursive(){
    var n = arguments.length;
    var graph_i = computeGraphIntersection(arguments[0], arguments[1]);
    if (n>2){
        for (i=2; i<n; i++){
            graph_i = computeGraphIntersection(graph_i, arguments[i]);
        };
    };
    return graph_i;
};

/** takes a variables number of Springy.Graphs as input to calculate their union.*/
function computeUnionRecursive(){
    var n = arguments.length;
    var graph_u = computeGraphUnion(arguments[0], arguments[1]);
    if (n>2){
        for (i=2; i<n; i++){
            graph_u = computeGraphUnion(graph_u, arguments[i]);
        };
    };
    return graph_u;
};

/**This function finds the nodes common to two graphs. 
 * it does not concern itself with edges or preferred locations.*/
function computeGraphIntersection(graph1, graph2){
    var graph_i = new Springy.Graph;
    for (i=0; i<graph1.nodes.length; i++){
        if(findNodeId(graph1.nodes[i].data.label, graph2) !== -1){
            graph_i.addNodes(graph1.nodes[i].data.label);
        };
    };
    return graph_i;
};

/** This function will take two Springy.Graphs and return a new Springy.Graph which 
 * is the union of the inputs.  The union function does not preserve node preferred locations.*/
function computeGraphUnion(graph1, graph2){
    var graph_u = new Springy.Graph;
    // add the nodes from each graph, with no duplicates.
    // the cardinality of nodes in the union is equal to the sum of the cardinalities of input nodes.
    for (i=0; i<graph1.nodes.length; i++){
        graph_u.addNodes(graph1.nodes[i].data.label);
        graph_u.nodes[i].cardinality = graph1.nodes[i].cardinality;
    };
    for (i=0; i<graph2.nodes.length; i++){
        var node_id_in_graph1 = findNodeId(graph2.nodes[i].data.label, graph1)
        if (node_id_in_graph1==-1){  // if true, then this node is in graph2, but not in graph1.
            graph_u.addNodes(graph2.nodes[i].data.label);
            var node_id_in_graph_u = findNodeId(graph2.nodes[i].data.label, graph_u);
            graph_u.nodes[node_id_in_graph_u].cardinality = graph2.nodes[i].cardinality;
        } else { // this node is in both graphs
            graph_u.nodes[node_id_in_graph1].cardinality = 
                graph1.nodes[node_id_in_graph1].cardinality + graph2.nodes[i].cardinality;
        };
    };

    // add the edges from each graph, taking care not to duplicate edges
    for (i=0; i<graph_u.nodes.length; i++){
        var node_label_i = graph_u.nodes[i].data.label;
        var node_id1_i = findNodeId(node_label_i, graph1);
        var node_id2_i = findNodeId(node_label_i, graph2);

        for (j=0; j<graph_u.nodes.length; j++){
            var node_label_j = graph_u.nodes[j].data.label;
            var node_id1_j = findNodeId(node_label_j, graph1);
            var node_id2_j = findNodeId(node_label_j, graph2);

            if(node_id1_i >= 0 && node_id1_j >= 0){
                var adjacency1 = graph1.getEdges(graph1.nodes[node_id1_i], graph1.nodes[node_id1_j]);
            } else { var adjacency1 = []; };
            if(node_id2_i >= 0 && node_id2_j >= 0){
                var adjacency2 = graph2.getEdges(graph2.nodes[node_id2_i], graph2.nodes[node_id2_j]);
            } else { var adjacency2 = []; };

            if (adjacency1.length > 0){
                graph_u.newEdge(
                adjacency1[0].source,
                adjacency1[0].target,
                adjacency1[0].data)
            } else if (adjacency2.length > 0){ 
                graph_u.newEdge(
                adjacency2[0].source,
                adjacency2[0].target,
                adjacency2[0].data)
            };
        };
    };
    //console.log(graph_u);
    return graph_u;
};

/**This function populates the preferred location fields of the nodes
 * of subGraph with the final positions (if present) of the nodes of
 * superGraph that are common to both graphs, as well as the cardinalities.*/
function updateSubGraphPreferredLocations(subGraph, superGraph){
    for (i=0; i<subGraph.nodes.length; i++){
        var super_id = findNodeId(subGraph.nodes[i].data.label, superGraph);
        if(super_id !== -1){
            subGraph.nodes[i].preferredLocation = { x: superGraph.nodes[super_id].finalPosition.x,
                                                    y: superGraph.nodes[super_id].finalPosition.y};
            subGraph.nodes[i].cardinality = superGraph.nodes[super_id].cardinality;
        };
    };
};

// ---------
// body
// ---------

var graphA = new Springy.Graph();
graphA.addNodes('Dennis', 'Michael', 'Jessica', 'Timothy', 'Barbara', 'Heracles', 'Slurm');
graphA.addEdges(
    ['Dennis', 'Michael', {color: '#00A0B0', label: 'Foo bar'}],
    ['Michael', 'Dennis', {color: '#6A4A3C'}],
    ['Michael', 'Jessica', {color: '#CC333F'}],
    ['Jessica', 'Barbara', {color: '#EB6841'}],
    ['Michael', 'Timothy', {color: '#EDC951'}],
    ['Barbara', 'Timothy', {color: '#6A4A3C'}],
    ['Timothy', 'Slurm', {color: '#6A4A3C'}],
    ['Slurm', 'Timothy', {color: '#6A4A3C'}],
    ['Slurm', 'Heracles', {color: '#6A4A3C'}],
    ['Heracles', 'Slurm', {color: '#6A4A3C'}],
    ['Slurm', 'Barbara'],
    ['Barbara', 'Slurm']
);
//graphA.addPreferredLocation('Dennis', -1.0, -1.0);
//graphA.addPreferredLocation('Michael', 1, -1.0);
//graphA.addPreferredLocation('Jessica', 3.0, -1.0);

var graphB = new Springy.Graph();
graphB.addNodes('Amphitryon', 'Alcmene', 'Iphicles', 'Heracles', 'Slurm', 'Barbara');
graphB.addEdges(
    ['Amphitryon', 'Alcmene', {color: '#7DBE3C'}],
    ['Alcmene', 'Amphitryon', {color: '#BE7D3C'}],
    ['Amphitryon', 'Iphicles'],
    ['Amphitryon', 'Heracles'],
    ['Slurm', 'Heracles', {color: '#6A4A3C'}],
    ['Heracles', 'Slurm', {color: '#6A4A3C'}],
    ['Slurm', 'Barbara'],
    ['Barbara', 'Slurm']
);
//graphB.addPreferredLocation('Alcmene', -1.0, -1.0);

var graphC = new Springy.Graph();
graphC.addNodes('Drizzt', 'Bruenor', 'Wulfgar', 'Regis', 'Catti-Brie', 'Guenwhyvar', 'Slurm');
graphC.addEdges(
    ['Drizzt', 'Bruenor', {color: '#00A0B0', label: 'Foo bar'}],
    ['Bruenor', 'Wulfgar', {color: '#6A4A3C'}],
    ['Wulfgar', 'Regis', {color: '#6A4A3C'}],
    ['Regis', 'Guenwhyvar', {color: '#6A4A3C'}],
    ['Catti-Brie', 'Guenwhyvar', {color: '#6A4A3C'}],
    ['Guenwhyvar', 'Drizzt', {color: '#6A4A3C'}],
    ['Wulfgar', 'Slurm']
);

var graph_u = computeUnionRecursive(graphA, graphB, graphC);
//graph_u.addPreferredLocation('Heracles', -1.0, -1.0);
//graph_u.addPreferredLocation('Catti-Brie', 0, 0);
//graph_u.addPreferredLocation('Slurm', -2.0, 0.0);


// compute the final layout for the union of input graphs, then 
jQuery(function(){
    var springy = jQuery('#springyU').springy({
        graph: graph_u,
        tetherStrength: 400.0
    })
});


function generateRenderings() {
    updateSubGraphPreferredLocations(graphA, graph_u);
    jQuery(function(){
        var springy = jQuery('#springyA').springy({
            graph: graphA,
            tetherStrength: 400.0
        });
    });

    updateSubGraphPreferredLocations(graphB, graph_u);
    jQuery(function(){
        var springy = jQuery('#springyB').springy({
            graph: graphB,
            tetherStrength: 400.0
        });
    }); 

    updateSubGraphPreferredLocations(graphC, graph_u);
    jQuery(function(){
        var springy = jQuery('#springyC').springy({
            graph: graphC,
            tetherStrength: 400.0
        });
    });
};




