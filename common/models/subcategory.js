module.exports = function(Subcategory) {
	Subcategory.validatesUniquenessOf('name');
	Subcategory.validatesUniquenessOf('orderId');
};
