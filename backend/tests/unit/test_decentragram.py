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
    hash = "randomhash"
    description = "here is your description"

    tx = decentragram.uploadPost(hash, description, {"from": account})
    assert decentragram.postCount() == 1

    assert tx.events["PostUploaded"][0]["id"] == 0
    assert tx.events["PostUploaded"][0]["hash"] == hash
    assert tx.events["PostUploaded"][0]["description"] == description
    assert tx.events["PostUploaded"][0]["owner"] == account

    post = decentragram.posts(0)
    assert post["id"] == 0
    assert post["tips"] == 0
    assert post["hash"] == hash
    assert post["description"] == description
    assert post["owner"] == account


def test_can_get_uploaded_posts():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    acc1 = get_account()
    acc2 = get_account(index=2)
    decentragram = deploy_decentragram()
    hash = "randomhash"
    description = "here is your description"

    decentragram.uploadPost(hash, description, {"from": acc1})
    decentragram.uploadPost(hash, description, {"from": acc2})
    decentragram.uploadPost(hash, description, {"from": acc1})
    decentragram.uploadPost(hash, description, {"from": acc1})
    decentragram.uploadPost(hash, description, {"from": acc2})
    acc1Posts = decentragram.getPostsFromOwner(acc1)
    acc2Posts = decentragram.getPostsFromOwner(acc2)
    anyPost = decentragram.posts(0)

    assert decentragram.postCount() == 5
    assert decentragram.ownerToPostCount(acc1) == 3
    assert decentragram.ownerToPostCount(acc2) == 2
    assert acc1Posts[0] == anyPost

    anotherPost = decentragram.posts(1)
    assert acc2Posts[0] == anotherPost


def test_try_uploading_post_without_hash():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    hash = ""
    description = "here is your description"

    with pytest.raises(exceptions.VirtualMachineError):
        tx = decentragram.uploadPost(hash, description, {"from": account})

    assert decentragram.postCount() == 0


def test_try_uploading_post_without_description():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    hash = "randomhash"
    description = ""

    with pytest.raises(exceptions.VirtualMachineError):
        tx = decentragram.uploadPost(hash, description, {"from": account})

    assert decentragram.postCount() == 0


def test_can_tip_post():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    hash = "randomhash"
    description = "here is your description"
    tx1 = decentragram.uploadPost(hash, description, {"from": account})
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
    hash = "randomhash"
    description = "here is your description"
    tx1 = decentragram.uploadPost(hash, description, {"from": account})
    tx1.wait(1)

    amount = Web3.toWei(1, "ether")
    with pytest.raises(exceptions.VirtualMachineError):
        decentragram.tipPost(4, {"from": account, "value": amount})


def test_user_withdraw_tips():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    hash = "randomhash"
    description = "here is your description"
    decentragram.uploadPost(hash, description, {"from": account})

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
    hash = "randomhash"
    description = "here is your description"
    decentragram.uploadPost(hash, description, {"from": account})
    decentragram.tipPost(0, {"from": account, "value": Web3.toWei(1, "ether")})

    random_user = get_account(index=2)
    with pytest.raises(exceptions.VirtualMachineError):
        decentragram.withdrawTips(0, {"from": random_user})


def test_unable_to_tip_amount_of_0():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIROMENTS:
        pytest.skip()
    account = get_account()
    decentragram = deploy_decentragram()
    hash = "randomhash"
    description = "here is your description"
    decentragram.uploadPost(hash, description, {"from": account})

    with pytest.raises(exceptions.VirtualMachineError):
        decentragram.tipPost(0, {"from": account})
