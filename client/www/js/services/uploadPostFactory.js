app.factory('uploadPostFactory', [
    function () {
        
        var post = {};
        
        var setPost = function (post) {
            this.post = post;
        };
        
        var getPost = function () {
            
            if (!this.post) {
                return {};
            }
            
            return this.post;
        };
          
        return {
            setPost: setPost,
            getPost: getPost
        };
    }
]); 