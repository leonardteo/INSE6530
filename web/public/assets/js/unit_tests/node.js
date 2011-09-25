/**
 * Node Unit Test
 */

module("Node");

//Test the constructor
test("Constructor", function(){
	
	node = new Node("testNode", null);
	
	//Test the parameters
	expectedID = "testNode";
	actualID = node.id;
	
	equal(actualID, expectedID);
	
	expectedParent = null;
	actualParent = node.parentNode;
	
	equal(actualParent, expectedParent);
	
	expectedChildNodes = 0;
	actualChildNodes = node.childNodes.length;
	
	equal(actualChildNodes, expectedChildNodes);
	
});

//Test adding children
test("AddChild", function(){
	
	rootNode = new Node("root", null);
	rootNode.addChild(new Node("child1"));
	rootNode.addChild(new Node("child2"));
	
	
	//Test that there actually are 2 children
	expectedNumChildren = 2;
	actualNumChildren = rootNode.childNodes.length;
	equal(actualNumChildren, expectedNumChildren);
	
	//Test getting the children
	children = rootNode.getChildren();
	expectedNumChildren = 2;
	actualNumChildren = children.length;
	equal(actualNumChildren, expectedNumChildren);
	
});

