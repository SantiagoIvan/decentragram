pragma solidity ^0.8.0;

import "./Ownable.sol";

contract Decentragram is Ownable {
    /*
    Que cosas voy a querer hacer?
    1- Postear una img
    2- Guardar archivos en la blockchain
    3- Tipear una imagen que pertenece a otro.
    Esto incluye una transferencia de una waller a otra, o simplemente puedo almacenar esos fondos
    y darle la opcion al dueño cuando quiera de retirarlos
    
    Para eso, tenemos que definir que queremos de una imagen:
    - url de la imagen
    - tips realizados

    Y voy a tener que mantener el rastro de todos los posts realizados.
    Por lo tanto de alguna forma voy a tener que mapear Post -> su dueño. Tal vez
    con un mapa o con una lista de Posts es suficiente

    Tambien voy a tener que mantener un conteo de la cantidad de posts totales. Esto me sirve
    para cualquier cosa que quiera hacer. Si quiero filtrar por ejemplo o realizar
    alguna operacion de busqueda sobre el array / mapa o lo que fuera a utilizar.

    Otro detalle importante: como los tips van a ser en ether, necesito primero pasarlos a Wei
    y ahi hacer la transformacion a otra moneda por ejemplo dolares, si quiero mostrar
    cuantos dolares en total tiene o ether.
    */
    struct Post {
        uint256 id;
        uint256 tips;
        uint256 totalTipsReceived;
        string path;
        string description;
        address payable owner;
    }
    uint256 public postCount;
    mapping(address => uint256) public ownerToPostCount; // para en un futuro en el perfil de una persona y traer todos los posts de esa
    Post[] public posts;

    event PostUploaded(
        uint256 indexed id,
        string path,
        string description,
        address indexed owner
    );

    event PostTipped(
        uint256 postId,
        uint256 indexed tips,
        address indexed from,
        address indexed owner
    );

    event TipsWithdrawed(uint256 id, address owner, uint256 amount);

    function uploadPost(string memory _imgPath, string memory _description)
        public
    {
        //Para asegurarse de que no me mandan cosas vacias
        require(bytes(_imgPath).length > 0, "Path empty!");
        require(bytes(_description).length > 0, "Description empty");
        require(msg.sender != address(0));

        posts.push(
            Post(postCount, 0, 0, _imgPath, _description, payable(msg.sender))
        );
        ownerToPostCount[msg.sender] += 1;

        //Como comunicar al frontend que fue creado exitosamente? Mediante un evento
        emit PostUploaded(postCount, _imgPath, _description, msg.sender);
        postCount++;
    }

    function tipPost(uint256 _id) external payable {
        require(postCount > 0, "No posts yet!");
        require(_id >= 0 && _id < postCount, "The id is incorrect!");
        require(
            msg.value > 0,
            "If you are gonna tip someone, please give him some money"
        );
        Post memory post = posts[_id];

        post.tips += msg.value;
        post.totalTipsReceived += msg.value;
        posts[_id] = post;

        emit PostTipped(post.id, post.tips, msg.sender, post.owner);
    }

    function withdrawTips(uint256 _id) external {
        require(_id >= 0 && _id < postCount, "The id is incorrect!");

        Post memory post = posts[_id];

        require(payable(msg.sender) == post.owner);
        uint256 _amount = post.tips;
        payable(msg.sender).transfer(post.tips);

        post.tips = 0;
        posts[_id] = post;

        emit TipsWithdrawed(_id, msg.sender, _amount);
    }

    function getPosts(
        uint256 _fromIndex,
        uint256 _toIndex /** intervalo cerrado */
    ) public view returns (Post[] memory) {
        require(postCount > 0, "No posts yet");
        require(_toIndex >= _fromIndex, "To index > From Index");
        require(_fromIndex < postCount, "Out of range!");

        uint256 _quantity = 0;
        if (_toIndex >= postCount) {
            //me estoy yendo del rango
            _quantity = postCount - _fromIndex;
        } else {
            _quantity = (_toIndex - _fromIndex) + 1; //o lo hago '<=' en el for, seria lo mismo
        }

        Post[] memory _filteredPosts = new Post[](_quantity);
        for (uint256 i = 0; i < _quantity; i++) {
            _filteredPosts[i] = posts[_fromIndex + i];
        }

        return _filteredPosts;
    }

    function getPostsFromOwner(address _owner)
        public
        view
        returns (Post[] memory)
    {
        require(ownerToPostCount[_owner] > 0, "That owner has no posts");
        Post[] memory _filteredPosts = new Post[](ownerToPostCount[_owner]);
        uint256 _counter = 0;

        for (uint256 i = 0; i < postCount; i++) {
            if (posts[i].owner == _owner) {
                _filteredPosts[_counter] = posts[i];
                _counter++;
            }
            if (_counter >= ownerToPostCount[_owner]) {
                break;
            }
        }
        return _filteredPosts;
    }
}
