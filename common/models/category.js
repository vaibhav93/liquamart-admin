module.exports = function(Category) {
	Category.validatesUniquenessOf('name');
	Category.validatesUniquenessOf('orderId');
};
