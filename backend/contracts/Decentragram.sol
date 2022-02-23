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
        string hash;
        string description;
        address payable owner;
    }
    uint256 public postCount;
    mapping(address => uint256) public ownerToPostCount;
    Post[] public posts;

    event PostUploaded(
        uint256 indexed id,
        string hash,
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

    function uploadPost(string memory _imgHash, string memory _description)
        public
    {
        //Para asegurarse de que no me mandan cosas vacias
        require(bytes(_imgHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0));

        posts.push(
            Post(postCount, 0, 0, _imgHash, _description, payable(msg.sender))
        );
        ownerToPostCount[msg.sender] += 1;

        //Como comunicar al frontend que fue creado exitosamente? Mediante un evento
        emit PostUploaded(postCount, _imgHash, _description, msg.sender);
        postCount++;
    }

    function tipPost(uint256 _id) external payable {
        require(_id >= 0 && _id < postCount);
        require(msg.value > 0);
        Post memory post = posts[_id];

        post.tips += msg.value;
        post.totalTipsReceived += msg.value;
        posts[_id] = post;

        emit PostTipped(post.id, post.tips, msg.sender, post.owner);
    }

    function withdrawTips(uint256 _id) external {
        require(_id >= 0 && _id < postCount);

        Post memory post = posts[_id];

        require(payable(msg.sender) == post.owner);
        uint256 _amount = post.tips;
        payable(msg.sender).transfer(post.tips);

        post.tips = 0;
        posts[_id] = post;

        emit TipsWithdrawed(_id, msg.sender, _amount);
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
