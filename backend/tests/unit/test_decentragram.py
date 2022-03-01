from brownie import network, exceptions
from web3 import Web3
from scripts.utils import LOCAL_BLOCKCHAIN_ENVIROMENTS, get_account
from scripts.deploy import deploy_decentragram
import pytest


def test_deploy_successfully():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()

    account = get_account()

    decentragram = deploy_decentragram()

    assert decentragram.owner() == account


def test_can_upload_post():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    path = "randompath"
    description = "here is your description"

    tx = decentragram.uploadPost(path, description, {"from": account})
    assert decentragram.postCount() == 1

    assert tx.events["PostUploaded"][0]["id"] == 0
    assert tx.events["PostUploaded"][0]["path"] == path
    assert tx.events["PostUploaded"][0]["description"] == description
    assert tx.events["PostUploaded"][0]["owner"] == account

    post = decentragram.posts(0)
    assert post["id"] == 0
    assert post["tips"] == 0
    assert post["path"] == path
    assert post["description"] == description
    assert post["owner"] == account


def test_can_get_uploaded_posts_from_owner():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    acc1 = get_account()
    acc2 = get_account(index=2)
    decentragram = deploy_decentragram()
    path = "randompath"
    description = "here is your description"

    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc2})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc2})
    acc1Posts = decentragram.getPostsFromOwner(acc1)
    acc2Posts = decentragram.getPostsFromOwner(acc2)
    anyPost = decentragram.posts(0)

    assert decentragram.postCount() == 5
    assert decentragram.ownerToPostCount(acc1) == 3
    assert decentragram.ownerToPostCount(acc2) == 2
    assert acc1Posts[0] == anyPost

    anotherPost = decentragram.posts(1)
    assert acc2Posts[0] == anotherPost


def test_can_get_uploaded_posts_from_index():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    acc1 = get_account()
    acc2 = get_account(index=2)
    decentragram = deploy_decentragram()
    path = "randompath"
    description = "here is your description"

    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc2})
    decentragram.uploadPost(path, description, {"from": acc2})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc2})
    decentragram.uploadPost(path, description, {"from": acc2})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc1})
    decentragram.uploadPost(path, description, {"from": acc2})
    decentragram.uploadPost(path, description, {"from": acc2})

    posts1 = decentragram.getPosts(0, 4)
    posts2 = decentragram.getPosts(10, 15)  # me trae hasta el index 13
    posts3 = decentragram.getPosts(0, 9)

    assert decentragram.postCount() == 14
    assert len(posts1) == 5
    assert len(posts2) == 4
    assert len(posts3) == 10


def test_try_uploading_post_without_path():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    path = ""
    description = "here is your description"

    with pytest.raises(exceptions.VirtualMachineError):
        tx = decentragram.uploadPost(path, description, {"from": account})

    assert decentragram.postCount() == 0


def test_try_uploading_post_without_description():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    path = "randompath"
    description = ""

    with pytest.raises(exceptions.VirtualMachineError):
        tx = decentragram.uploadPost(path, description, {"from": account})

    assert decentragram.postCount() == 0


def test_can_tip_post():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    path = "randompath"
    description = "here is your description"
    tx1 = decentragram.uploadPost(path, description, {"from": account})
    tx1.wait(1)

    amount = Web3.toWei(1, "ether")
    tx2 = decentragram.tipPost(0, {"from": account, "value": amount})
    post = decentragram.posts(0)

    assert post["tips"] == amount
    assert tx2.events["PostTipped"][0]["postId"] == 0
    assert tx2.events["PostTipped"][0]["tips"] == amount
    assert tx2.events["PostTipped"][0]["owner"] == account


def test_tip_post_that_doesnt_exists_raises_exception():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    path = "randompath"
    description = "here is your description"
    tx1 = decentragram.uploadPost(path, description, {"from": account})
    tx1.wait(1)

    amount = Web3.toWei(1, "ether")
    with pytest.raises(exceptions.VirtualMachineError):
        decentragram.tipPost(4, {"from": account, "value": amount})


def test_user_withdraw_tips():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    path = "randompath"
    description = "here is your description"
    decentragram.uploadPost(path, description, {"from": account})

    acc2 = get_account(index=2)
    decentragram.tipPost(0, {"from": acc2, "value": Web3.toWei(1, "ether")})
    decentragram.withdrawTips(0, {"from": account})

    post = decentragram.posts(0)
    assert post["tips"] == 0
    assert post["totalTipsReceived"] == Web3.toWei(1, "ether")


def test_random_user_tries_withdraw_tips_but_fails():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    path = "randompath"
    description = "here is your description"
    decentragram.uploadPost(path, description, {"from": account})
    decentragram.tipPost(0, {"from": account, "value": Web3.toWei(1, "ether")})

    random_user = get_account(index=2)
    with pytest.raises(exceptions.VirtualMachineError):
        decentragram.withdrawTips(0, {"from": random_user})


def test_unable_to_tip_amount_of_0():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    path = "randompath"
    description = "here is your description"
    decentragram.uploadPost(path, description, {"from": account})

    with pytest.raises(exceptions.VirtualMachineError):
        decentragram.tipPost(0, {"from": account})
