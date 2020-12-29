//actions panel stuff
var actionsWidth = 150;
var statusCodetraceWidth = 420;

var isSearchOpen = false;
var isInsertOpen = false;
var isRemoveOpen = false;
// Bắt sự kiện theo Id
// tìm kiếm
function openSearch() {
	if(!isSearchOpen) {
		// có các sự kiện tìm mã, tìm min, tìm kiếm theo đối truyền vào, thực hiện
		$('#find-min').animate({
			width: "+="+65
		}, 100, function() {
			$('#find-max').animate({
				width: "+="+69
			}, 100, function() {
				$('#search-input').animate({
					width: "+="+32
				}, 100, function() {
					$('#search-go').animate({
						width: "+="+34
					},100);
				});
			});
		});
	}
	isSearchOpen = true;
}
// đóng panel tìm kiếm
function closeSearch() {
	if(true) {
		$('#search-err').html("");
		$('#search-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#search-input').animate({
				width: "-="+32
			}, 100, function() {
				$('#find-max').animate({
					width: "-="+69
				}, 100, function() {
					$('#find-min').animate({
						width: "-="+65
					},100);
				});
			});
		});
		isSearchOpen = false;
	}
}
// tìm kiếm theo đối truyền vào và thực hiện
function openInsert() {
	if(!isInsertOpen) {
		$('#insert-input').animate({
			width: "+="+132
		}, 250, function() {
			$('#insert-go').animate({
				width: "+="+34
			},100);
		});
	}
	isInsertOpen = true;
}
function closeInsert() {
	if(true) {
		$('#insert-err').html("");
		$('#insert-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#insert-input').animate({
				width: "-="+132
			}, 250);
		});
		isInsertOpen = false;
	}
}
// xóa theo đối truyền vào  và thực hiện
function openRemove() {
	if(!isRemoveOpen) {
		$('#remove-input').animate({
			width: "+="+132
		}, 250, function() {
			$('#remove-go').animate({
				width: "+="+34
			},100);
		});
	}
	isRemoveOpen = true;
}
function closeRemove() {
	if(true) {
		$('#remove-err').html("");
		$('#remove-go').animate({
			width: "-="+34
		}, 100, function() {
			$('#remove-input').animate({
				width: "-="+132
			}, 250);
		});
		isRemoveOpen = false;
	}
}
// Ẩn panel
function hideEntireActionsPanel() {
	closeSearch();
	closeInsert();
	closeRemove();
	hideActionsPanel();
}
// bắt 1 sự kiện  sẽ đóng các sự kiện còn lại
$( document ).ready(function() {
	
	//the actions with pullout inputs
	$('#search').click(function() {
		closeInsert();
		closeRemove();
		openSearch();
		$('#inorder-err').html("");
	});
	$('#insert').click(function() {
		closeSearch();
		closeRemove();
		openInsert();
		$('#inorder-err').html("");
	});
	$('#remove').click(function() {
		closeSearch();
		closeInsert();
		openRemove();
		$('#inorder-err').html("");
	});
	
	//and the others
	$('#inorder').click(function() {
		closeSearch();
		closeInsert();
		closeRemove();
	});
	
	//chuyển tiếp giữa các tutorial
	$('#bst-tutorial-2 .tutorial-next').click(function() {
		showActionsPanel();
	});
	$('#bst-tutorial-3 .tutorial-next').click(function() {
		hideEntireActionsPanel();
	});
	$('#bst-tutorial-4 .tutorial-next').click(function() {
		showStatusPanel();
	});
	$('#bst-tutorial-5 .tutorial-next').click(function() {
		hideStatusPanel();
		showCodetracePanel();
	});
	$('#bst-tutorial-6 .tutorial-next').click(function() {
		hideCodetracePanel();
	});
});