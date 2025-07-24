const view = document.getElementById("view");
const restart_btn = document.getElementById("restart_btn");
const clean_btn = document.getElementById("clean_btn");
const root_element = document.getElementById("root_element");
const parent_node_btn = document.getElementById("parent_node_btn");

const FLOOR_LIMIT = 5;

const colors = {
  "black": "#363b54",
  "red": "#f7768e",
  "green": "#41a6b5",
  "yellow": "#e0af68",
  "blue": "#7aa2f7",
  "purple": "#bb9af7",
  "cyan": "#7dcfff",
  "white": "#787c99",
  "brightBlack": "#363b54",
  "brightRed": "#f7768e",
  "brightGreen": "#41a6b5",
  "brightYellow": "#e0af68",
  "brightBlue": "#7aa2f7",
  "brightPurple": "#bb9af7",
  "brightCyan": "#7dcfff",
  "brightWhite": "#acb0d0",
  "foreground": "#787c99"
} 
var tree = {};

function Tree(data) {
	this.value = data;
	this.children = []; 
	this.root = new Node(data[0]);
}

function Node(data) {
	this.value = data;
	let children = data.children;
	if(children)
	{
		for(let i = 0; i < children.length; i++){
			let child = children[i]
			if(child.binary_placement == "Left"){
				this.left = new Node(child)
			}
			else if(child.binary_placement == "Right"){
				this.right = new Node(child)
			}
		}
	}
}


const getBaseTree = async () => {
	let file = await fetch("data/Daxcsa.json");
	tree = await file.json();
	drawTree();
}

var structure;

const drawTree = () => {
	structure = new Tree(tree.data.attributes);
	data_type.innerText = tree.data.type;
	iterateTree();
}

const iterateTree = () => {
	let root = structure.root;
	addDetailsTo(root_element, root);
	recursiveElemental(root);
}

const recursiveElemental = (node, isRoot) => {
 let parent_element = document.querySelector("div[distributor_id='"+node.value.parent_id+"']") || null;
 let parent_level = 0;
 let parent_cell = 0;
 if(parent_element){
 	parent_level = Number(parent_element.parentNode.getAttribute("level"));
 	parent_cell = Number(parent_element.getAttribute("cell"));
 }
 if(parent_level >= FLOOR_LIMIT){
 	return;
 }
 let binary = node.value.binary_placement;
 let current_cell = 0;
 if(binary == "Left"){
 	current_cell = (parent_cell*2);
 }
 if(binary == "Right" && !isRoot){
 	current_cell = (parent_cell*2)+1;
 }
 let current_element = document.querySelector("div[level='"+(parent_level+1)+"'] > div[cell='"+(current_cell)+"']") 
 addDetailsTo(current_element, node);

 if(node.left){
 	recursiveElemental(node.left);
 }
 
 if(node.right){
 	recursiveElemental(node.right)
 }
}

const getElementCell = (level, cell) => {
	return document.querySelector("div[level ='"+ level+"'] > div[cell='"+cell+"']");
}

const addDetailsTo = (element, node) => {	
	element.style.background = colors.blue;
	element.innerHTML = "<h3>" + node.value.full_name +"</h3><p>"+node.value.username +"</p>"
	element.setAttribute("distributor_id", node.value.distributor_id);
}

var new_root_node = {};
var parent_node_id;

const searchNewRoot = (id) => {	
	deepSearch(structure.root, Number(id));
	return new_root_node;
}

const deepSearch = (node, id) => {
try {
	if(node.value.distributor_id == id){
		parent_node_id = node.value.parent_id;
		new_root_node = node;
	}
	if(node.left){
		deepSearch(node.left, id);
	}

	if(node.right){
		deepSearch(node.right, id);
	}
	}
catch(error){
	}
}

const clearSelection = () => {
	document.querySelectorAll(".node").forEach(ele => {
		ele.innerHTML = "";
		ele.removeAttribute("distributor_id");
		ele.removeAttribute("style");
	}); 
}

const setNewRoot = (new_root) => {
	if(!new_root){return}
	clearSelection();
	addDetailsTo(root_element, new_root);
	recursiveElemental(new_root, true);
}

view.addEventListener("click", (event) => {
	let id = event.target.getAttribute("distributor_id") || event.target.parentNode.getAttribute("distributor_id");
	if(id){
		let new_root = searchNewRoot(id);
		setNewRoot(new_root);
	}
})

restart_btn.onclick = iterateTree;

parent_node_btn.addEventListener("click", () => {
	let new_root = searchNewRoot(parent_node_id);
	setNewRoot(new_root);
});

getBaseTree();
